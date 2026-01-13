import {
    baseURL,
    contentType,
    debounce,
    invalidCode,
    loginInterception,
    noPermissionCode,
    requestTimeout,
    successCode,
    tokenName,
} from "@/config";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { isArray } from "@/utils/validate";
import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
import { identity, pickBy } from "lodash-es";
import qs from "qs";
// 导入 Mock 控制相关函数
import { getRealApiUrl } from "@/config/mock.config";
import { checkForceMode, mockRequestInterceptor } from "./mockInterceptor";

// 在生产环境下引入mock数据
// Vite 使用 import.meta.glob 替代 require.context
if (process.env.NODE_ENV === "prod") {
  // 使用 eager: true 立即导入所有 mock 文件
  const mockModules = import.meta.glob('../../mock/controller/**/*.js', { eager: true })
  Object.values(mockModules).forEach((module) => {
    // Mock 模块已经被导入，无需额外处理
  })
}

let loadingInstance;

/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case invalidCode:
      ElMessage.error(msg || `后端接口${code}异常`);
      const userStore = useUserStore();
      userStore.resetAccessToken();
      if (loginInterception) {
        location.reload();
      }
      break;
    case noPermissionCode:
      router.push({ path: "/401" }).catch(() => {});
      break;
    default:
      ElMessage.error(msg || `后端接口${code}异常`);
      break;
  }
};

// 请求重试配置
const retryConfig = {
  retry: 3, // 重试次数
  retryDelay: 1000, // 重试间隔时间
};

// 创建axios实例
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    "Content-Type": contentType,
  },
});

// 请求重试方法
instance.defaults.retry = retryConfig.retry;
instance.defaults.retryDelay = retryConfig.retryDelay;

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // ===== 新增：Mock 控制逻辑 =====
    // 1. 检查是否有强制标记
    const forceMode = checkForceMode(config);
    
    if (forceMode === 'mock') {
      // 强制使用 Mock，不做任何修改
      // 继续使用原有的 baseURL
    } else if (forceMode === 'real') {
      // 强制使用真实 API
      const realApiUrl = getRealApiUrl();
      if (config.url.includes('/vab-mock-server/')) {
        config.url = config.url.replace('/vab-mock-server/', '/');
      }
      config.baseURL = realApiUrl;
    } else {
      // 2. 根据配置决定使用 Mock 还是真实 API
      config = mockRequestInterceptor(config);
    }
    // ===== Mock 控制逻辑结束 =====

    // 3. 添加 token
    const userStore = useUserStore();
    if (userStore.accessToken) {
      config.headers[tokenName] = userStore.accessToken;
    }

    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    if (config.data) config.data = pickBy(config.data, identity);
    if (
      config.data &&
      config.headers["Content-Type"] ===
        "application/x-www-form-urlencoded;charset=UTF-8"
    )
      config.data = qs.stringify(config.data);
    if (debounce.some((item) => config.url.includes(item)))
      loadingInstance = ElLoading.service();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close();

    const { data, config } = response;

    // 判断data是否为undefined或null
    if (data === undefined || data === null) {
      ElMessage.error("后端接口返回数据为空");
      return Promise.reject("后端接口返回数据为空");
    }

    // 安全地解构code和msg，避免undefined异常
    const code = data.code !== undefined ? data.code : null;
    const msg = data.msg !== undefined ? data.msg : "未知错误";

    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]];

    // 是否操作正常
    if (code !== null && codeVerificationArray.includes(code)) {
      return data;
    } else {
      handleCode(code, msg);
      return Promise.reject(
        `vue-admin-better请求异常拦截:${JSON.stringify({
          url: config.url,
          code,
          msg,
        })}` || "Error"
      );
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close();

    // 处理请求重试
    const { config } = error;
    if (config && config.retry) {
      // 设置当前重试次数
      config.__retryCount = config.__retryCount || 0;

      // 检查是否可以重试
      if (config.__retryCount < config.retry) {
        // 增加重试次数
        config.__retryCount += 1;

        // 创建新的Promise进行重试
        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            console.log(
              `重试请求: ${config.url}, 尝试次数: ${config.__retryCount}`
            );
            resolve();
          }, config.retryDelay || 1000);
        });

        // 重新发起请求
        return backoff.then(() => instance(config));
      }
    }

    // 处理undefined或无法解析的错误情况
    if (!error) {
      ElMessage.error("发生未知错误");
      return Promise.reject("发生未知错误");
    }

    const { response, message } = error;
    if (response && response.data) {
      const { status, data } = response;
      handleCode(status, data.msg || message || "未知错误");
      return Promise.reject(error);
    } else {
      let errorMsg = "后端接口未知异常";

      if (message) {
        if (message === "Network Error") {
          errorMsg = "后端接口连接异常";
        } else if (message.includes("timeout")) {
          errorMsg = "后端接口请求超时";
        } else if (message.includes("Request failed with status code")) {
          const code = message.substr(message.length - 3);
          errorMsg = `后端接口${code}异常`;
        }
      }

      ElMessage.error(errorMsg);
      return Promise.reject(error);
    }
  }
);

export default instance;
