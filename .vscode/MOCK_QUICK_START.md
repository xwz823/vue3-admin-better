# Mock 控制 - 快速开始指南

## 🚀 5分钟快速实施

### 第一步：创建配置文件（2分钟）

#### 1. 创建 `src/config/mock.config.js`

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',  // 推荐使用白名单模式
  
  // 配置哪些接口使用 Mock
  mockWhiteList: [
    '/vab-mock-server/user/login',
    '/vab-mock-server/userInfo',
    '/vab-mock-server/router/getList',
    '/vab-mock-server/table/*',
    '/vab-mock-server/tree/*',
    '/vab-mock-server/icon/*',
  ],
  
  // 真实后端地址
  realApiConfig: {
    development: 'http://localhost:3000/api',
    production: 'https://api.yourdomain.com',
  },
  
  debug: true,  // 开启调试日志
};

function matchRule(url, rules) {
  if (!rules || rules.length === 0) return false;
  return rules.some(rule => {
    if (rule instanceof RegExp) return rule.test(url);
    if (rule.includes('*')) {
      const regexPattern = rule.replace(/\*/g, '.*').replace(/\//g, '\\/');
      return new RegExp(`^${regexPattern}$`).test(url);
    }
    return url === rule || url.startsWith(rule);
  });
}

export function shouldUseMock(url) {
  if (!mockConfig.enableMock) return false;
  
  switch (mockConfig.mockMode) {
    case 'whitelist':
      return matchRule(url, mockConfig.mockWhiteList);
    case 'blacklist':
      return !matchRule(url, mockConfig.mockBlackList);
    case 'all':
    default:
      return true;
  }
}

export function getRealApiUrl() {
  const env = process.env.NODE_ENV || 'development';
  return mockConfig.realApiConfig[env] || mockConfig.realApiConfig.development;
}

export function logMockInfo(url, useMock) {
  if (!mockConfig.debug) return;
  const type = useMock ? 'Mock' : 'Real API';
  const style = useMock 
    ? 'color: #67C23A; font-weight: bold;' 
    : 'color: #409EFF; font-weight: bold;';
  console.log(`%c[${type}] ${url}`, style);
}

export default mockConfig;
```

#### 2. 创建 `src/utils/mockInterceptor.js`

```javascript
import { shouldUseMock, getRealApiUrl, logMockInfo } from '@/config/mock.config';

export function mockRequestInterceptor(config) {
  const fullUrl = config.url.startsWith('http') 
    ? config.url 
    : `${config.baseURL}${config.url}`;

  const useMock = shouldUseMock(fullUrl);
  logMockInfo(fullUrl, useMock);

  if (!useMock) {
    const realApiUrl = getRealApiUrl();
    if (config.url.includes('/vab-mock-server/')) {
      config.url = config.url.replace('/vab-mock-server/', '/');
    }
    config.baseURL = realApiUrl;
  }

  return config;
}

export function markAsMock() {
  return { headers: { 'X-Force-Mock': 'true' } };
}

export function markAsReal() {
  return { headers: { 'X-Force-Real': 'true' } };
}

export function checkForceMode(config) {
  const headers = config.headers || {};
  if (headers['X-Force-Mock'] === 'true') return 'mock';
  if (headers['X-Force-Real'] === 'true') return 'real';
  return null;
}
```

---

### 第二步：修改请求拦截器（2分钟）

在 `src/utils/request.js` 中修改：

```javascript
// 1. 在文件顶部添加导入
import { mockRequestInterceptor, checkForceMode } from './mockInterceptor';
import { getRealApiUrl } from '@/config/mock.config';

// 2. 找到请求拦截器（大约在第 150 行），修改为：
instance.interceptors.request.use(
  (config) => {
    // ===== 新增：Mock 控制逻辑 =====
    const forceMode = checkForceMode(config);
    
    if (forceMode === 'mock') {
      // 强制使用 Mock
    } else if (forceMode === 'real') {
      config.baseURL = getRealApiUrl();
      if (config.url.includes('/vab-mock-server/')) {
        config.url = config.url.replace('/vab-mock-server/', '/');
      }
    } else {
      config = mockRequestInterceptor(config);
    }
    // ===== Mock 控制逻辑结束 =====

    // 原有的 token 添加逻辑
    const userStore = useUserStore();
    if (userStore.accessToken) {
      config.headers[tokenName] = userStore.accessToken;
    }

    // ... 其他原有逻辑保持不变
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

### 第三步：创建环境变量（1分钟）

#### 1. 创建 `.env.development`

```bash
# 开发环境 - 真实后端地址
VUE_APP_API_BASE_URL=http://localhost:3000/api
```

#### 2. 创建 `.env.production`

```bash
# 生产环境 - 真实后端地址
VUE_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## ✅ 验证安装

### 1. 重启开发服务器

```bash
# Ctrl + C 停止当前服务
npm run dev
```

### 2. 打开浏览器控制台

你应该看到类似的日志：

```
[Mock] /vab-mock-server/user/login
[Real API] /vab-mock-server/product/list
[Mock] /vab-mock-server/table/getList
```

### 3. 检查 Network 面板

- Mock 请求：URL 包含 `/vab-mock-server/`
- 真实请求：URL 指向你配置的真实后端地址

---

## 🎯 常用配置场景

### 场景 1：全部使用 Mock（默认）

```javascript
// mock.config.js
mockMode: 'all',
```

### 场景 2：只有登录和表格使用 Mock

```javascript
// mock.config.js
mockMode: 'whitelist',
mockWhiteList: [
  '/vab-mock-server/user/login',
  '/vab-mock-server/table/*',
],
```

### 场景 3：全部真实 API

```javascript
// mock.config.js
enableMock: false,
```

### 场景 4：在代码中强制指定

```javascript
// src/api/user.js
import { markAsMock, markAsReal } from '@/utils/mockInterceptor';

// 强制使用 Mock
export function getUserList() {
  return request({
    url: '/vab-mock-server/user/list',
    method: 'get',
    ...markAsMock()
  });
}

// 强制使用真实 API
export function createOrder(data) {
  return request({
    url: '/vab-mock-server/order/create',
    method: 'post',
    data,
    ...markAsReal()
  });
}
```

---

## 🔧 配置说明

### mockMode 模式选择

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `all` | 全部使用 Mock | 后端未开发完成 |
| `whitelist` | 白名单模式（推荐） | 部分接口联调 |
| `blacklist` | 黑名单模式 | 大部分接口已联调 |

### 匹配规则

```javascript
mockWhiteList: [
  '/vab-mock-server/user/login',    // 精确匹配
  '/vab-mock-server/table/*',       // 通配符匹配
  /\/user\/.*\/detail/,              // 正则匹配
]
```

---

## 🐛 故障排查

### 问题 1：修改配置不生效

**解决**：重启开发服务器
```bash
Ctrl + C
npm run dev
```

### 问题 2：真实 API 返回 404

**检查**：
1. `realApiConfig` 地址是否正确
2. 后端服务是否启动
3. 控制台是否有 CORS 错误

### 问题 3：看不到调试日志

**解决**：确保 `debug: true`
```javascript
// mock.config.js
debug: true,
```

---

## 📚 更多信息

详细文档请查看：`.vscode/MOCK_CONTROL_SOLUTION.md`

---

**快速开始完成！** 🎉

现在你可以灵活控制哪些接口使用 Mock，哪些调用真实后端了。
