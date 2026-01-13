# Mock 接口控制方案

## 📋 方案概述

本方案提供了一个灵活的 Mock 开关系统，允许你：
- ✅ 全局开启/关闭 Mock
- ✅ 针对特定接口启用/禁用 Mock
- ✅ 配置真实后端 API 地址
- ✅ 开发环境和生产环境独立配置

---

## 🎯 实现方案

### 方案架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端请求                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Mock 配置检查                               │
│  (src/config/mock.config.js)                            │
│  - 全局开关: enableMock                                  │
│  - 接口白名单: mockWhiteList                             │
│  - 接口黑名单: mockBlackList                             │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   使用 Mock     │    │  调用真实 API    │
│  (Mock Server)  │    │  (Real Backend)  │
└─────────────────┘    └─────────────────┘
```

---

## 📁 文件结构

```
vue3-admin-better/
├── src/
│   ├── config/
│   │   ├── mock.config.js          # Mock 配置文件（新建）
│   │   ├── net.config.js           # 网络配置（修改）
│   │   └── index.js                # 配置入口（修改）
│   ├── utils/
│   │   ├── request.js              # Axios 请求封装（修改）
│   │   └── mockInterceptor.js      # Mock 拦截器（新建）
│   └── api/
│       └── *.js                    # API 定义文件
├── mock/
│   └── controller/                 # Mock 数据
└── .env.development                # 环境变量（新建）
```

---

## 🔧 实施步骤

### 步骤 1: 创建 Mock 配置文件

**文件**: `src/config/mock.config.js`

```javascript
/**
 * @description Mock 数据配置
 * 用于控制哪些接口使用 Mock 数据，哪些调用真实后端
 */

const mockConfig = {
  // ============ 全局配置 ============
  
  /**
   * 是否启用 Mock
   * true: 启用 Mock（根据白名单/黑名单规则）
   * false: 完全禁用 Mock，所有请求走真实后端
   */
  enableMock: true,

  /**
   * Mock 模式
   * 'whitelist': 白名单模式 - 只有在 mockWhiteList 中的接口才使用 Mock
   * 'blacklist': 黑名单模式 - 除了在 mockBlackList 中的接口，其他都使用 Mock
   * 'all': 全部 Mock - 所有接口都使用 Mock（默认模式）
   */
  mockMode: 'whitelist',

  // ============ 白名单模式配置 ============
  
  /**
   * Mock 白名单
   * 当 mockMode = 'whitelist' 时生效
   * 只有在此列表中的接口才会使用 Mock 数据
   * 
   * 支持三种匹配方式：
   * 1. 精确匹配: '/vab-mock-server/user/login'
   * 2. 前缀匹配: '/vab-mock-server/user/*' (匹配所有 user 相关接口)
   * 3. 正则匹配: /\/user\/.*\/detail/ (使用正则表达式)
   */
  mockWhiteList: [
    // 用户相关接口使用 Mock
    '/vab-mock-server/user/login',
    '/vab-mock-server/user/logout',
    '/vab-mock-server/userInfo',
    
    // 路由相关接口使用 Mock
    '/vab-mock-server/router/getList',
    
    // 表格数据使用 Mock
    '/vab-mock-server/table/*',
    
    // 树形数据使用 Mock
    '/vab-mock-server/tree/*',
    
    // 图标数据使用 Mock
    '/vab-mock-server/icon/*',
  ],

  // ============ 黑名单模式配置 ============
  
  /**
   * Mock 黑名单
   * 当 mockMode = 'blacklist' 时生效
   * 在此列表中的接口将调用真实后端，其他接口使用 Mock
   * 
   * 支持三种匹配方式（同白名单）
   */
  mockBlackList: [
    // 示例：这些接口调用真实后端
    // '/api/product/*',      // 商品相关接口
    // '/api/order/*',        // 订单相关接口
    // '/api/payment/*',      // 支付相关接口
  ],

  // ============ 真实后端配置 ============
  
  /**
   * 真实后端 API 地址
   * 当接口不使用 Mock 时，将请求此地址
   */
  realApiConfig: {
    // 开发环境真实后端地址
    development: 'http://localhost:3000/api',
    
    // 生产环境真实后端地址
    production: 'https://api.yourdomain.com',
    
    // 测试环境真实后端地址（可选）
    test: 'https://test-api.yourdomain.com',
  },

  // ============ 调试配置 ============
  
  /**
   * 是否在控制台打印 Mock 信息
   * true: 打印每个请求是使用 Mock 还是真实 API
   * false: 不打印
   */
  debug: true,

  /**
   * 控制台日志样式
   */
  logStyle: {
    mock: 'color: #67C23A; font-weight: bold;',      // Mock 请求 - 绿色
    real: 'color: #409EFF; font-weight: bold;',      // 真实请求 - 蓝色
    error: 'color: #F56C6C; font-weight: bold;',     // 错误 - 红色
  },
};

/**
 * 检查 URL 是否匹配规则
 * @param {string} url - 请求 URL
 * @param {Array} rules - 匹配规则列表
 * @returns {boolean}
 */
function matchRule(url, rules) {
  if (!rules || rules.length === 0) return false;

  return rules.some(rule => {
    // 1. 正则表达式匹配
    if (rule instanceof RegExp) {
      return rule.test(url);
    }

    // 2. 通配符匹配
    if (rule.includes('*')) {
      const regexPattern = rule
        .replace(/\*/g, '.*')           // * 转换为 .*
        .replace(/\//g, '\\/');         // / 转义
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(url);
    }

    // 3. 精确匹配
    return url === rule || url.startsWith(rule);
  });
}

/**
 * 判断是否应该使用 Mock
 * @param {string} url - 请求 URL
 * @returns {boolean}
 */
export function shouldUseMock(url) {
  // 如果全局禁用 Mock，直接返回 false
  if (!mockConfig.enableMock) {
    return false;
  }

  // 根据不同模式判断
  switch (mockConfig.mockMode) {
    case 'whitelist':
      // 白名单模式：只有在白名单中的才使用 Mock
      return matchRule(url, mockConfig.mockWhiteList);

    case 'blacklist':
      // 黑名单模式：不在黑名单中的才使用 Mock
      return !matchRule(url, mockConfig.mockBlackList);

    case 'all':
    default:
      // 全部 Mock 模式
      return true;
  }
}

/**
 * 获取真实 API 地址
 * @returns {string}
 */
export function getRealApiUrl() {
  const env = process.env.NODE_ENV || 'development';
  return mockConfig.realApiConfig[env] || mockConfig.realApiConfig.development;
}

/**
 * 打印调试信息
 * @param {string} url - 请求 URL
 * @param {boolean} useMock - 是否使用 Mock
 */
export function logMockInfo(url, useMock) {
  if (!mockConfig.debug) return;

  const type = useMock ? 'Mock' : 'Real API';
  const style = useMock ? mockConfig.logStyle.mock : mockConfig.logStyle.real;
  
  console.log(
    `%c[${type}] ${url}`,
    style
  );
}

export default mockConfig;
```

---

### 步骤 2: 更新网络配置

**文件**: `src/config/net.config.js`

```javascript
/**
 * @description 导出默认网络配置
 **/
const network = {
  // Mock Server 地址
  mockBaseURL:
    process.env.NODE_ENV === "production"
      ? "./vab-mock-server"
      : "/vab-mock-server",
  
  // 真实后端 API 地址（从环境变量读取，或使用默认值）
  realBaseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:3000/api",
  
  // 默认使用 Mock Server（将在请求拦截器中根据配置动态切换）
  baseURL:
    process.env.NODE_ENV === "production"
      ? "./vab-mock-server"
      : "/vab-mock-server",
  
  // 配后端数据的接收方式
  contentType: "application/json;charset=UTF-8",
  
  // 消息框消失时间
  messageDuration: 3000,
  
  // 最长请求时间
  requestTimeout: 15000,
  
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0],
  
  // 登录失效code
  invalidCode: 402,
  
  // 无权限code
  noPermissionCode: 401,
};

module.exports = network;
```

---

### 步骤 3: 创建 Mock 拦截器

**文件**: `src/utils/mockInterceptor.js`

```javascript
import { shouldUseMock, getRealApiUrl, logMockInfo } from '@/config/mock.config';
import { baseURL } from '@/config';

/**
 * Mock 请求拦截器
 * 根据配置决定请求是使用 Mock 还是真实 API
 * @param {Object} config - Axios 请求配置
 * @returns {Object} 修改后的配置
 */
export function mockRequestInterceptor(config) {
  // 获取完整的请求 URL
  const fullUrl = config.url.startsWith('http') 
    ? config.url 
    : `${config.baseURL || baseURL}${config.url}`;

  // 判断是否使用 Mock
  const useMock = shouldUseMock(fullUrl);

  // 打印调试信息
  logMockInfo(fullUrl, useMock);

  // 根据判断结果修改 baseURL
  if (!useMock) {
    // 使用真实 API
    const realApiUrl = getRealApiUrl();
    
    // 如果原 URL 包含 Mock Server 路径，需要替换
    if (config.url.includes('/vab-mock-server/')) {
      config.url = config.url.replace('/vab-mock-server/', '/');
    }
    
    // 设置真实 API 的 baseURL
    config.baseURL = realApiUrl;
    
    // 可以在这里添加真实 API 需要的额外配置
    // 例如：不同的认证方式、额外的 headers 等
    // config.headers['X-Real-API'] = 'true';
  }

  return config;
}

/**
 * 批量配置接口 Mock 状态的辅助函数
 * 用于在代码中快速标记某个接口是否使用 Mock
 * 
 * @example
 * import { markAsMock, markAsReal } from '@/utils/mockInterceptor';
 * 
 * // 标记为使用 Mock
 * export function getUserList() {
 *   return request({
 *     url: '/user/list',
 *     method: 'get',
 *     ...markAsMock()  // 强制使用 Mock
 *   });
 * }
 * 
 * // 标记为使用真实 API
 * export function createOrder(data) {
 *   return request({
 *     url: '/order/create',
 *     method: 'post',
 *     data,
 *     ...markAsReal()  // 强制使用真实 API
 *   });
 * }
 */

/**
 * 标记请求强制使用 Mock
 * @returns {Object}
 */
export function markAsMock() {
  return {
    headers: {
      'X-Force-Mock': 'true'
    }
  };
}

/**
 * 标记请求强制使用真实 API
 * @returns {Object}
 */
export function markAsReal() {
  return {
    headers: {
      'X-Force-Real': 'true'
    }
  };
}

/**
 * 检查请求是否被标记为强制 Mock 或真实 API
 * @param {Object} config - Axios 请求配置
 * @returns {string|null} 'mock' | 'real' | null
 */
export function checkForceMode(config) {
  const headers = config.headers || {};
  
  if (headers['X-Force-Mock'] === 'true') {
    return 'mock';
  }
  
  if (headers['X-Force-Real'] === 'true') {
    return 'real';
  }
  
  return null;
}
```

---

### 步骤 4: 更新 Axios 请求封装

**文件**: `src/utils/request.js`

在现有的 `request.js` 文件中添加 Mock 拦截器：

```javascript
// 在文件顶部添加导入
import { mockRequestInterceptor, checkForceMode } from './mockInterceptor';
import { getRealApiUrl } from '@/config/mock.config';

// 在请求拦截器中添加（大约在第 150 行左右）
instance.interceptors.request.use(
  (config) => {
    // 1. 检查是否有强制标记
    const forceMode = checkForceMode(config);
    
    if (forceMode === 'mock') {
      // 强制使用 Mock，不做任何修改
      return config;
    } else if (forceMode === 'real') {
      // 强制使用真实 API
      config.baseURL = getRealApiUrl();
      if (config.url.includes('/vab-mock-server/')) {
        config.url = config.url.replace('/vab-mock-server/', '/');
      }
    } else {
      // 2. 根据配置决定使用 Mock 还是真实 API
      config = mockRequestInterceptor(config);
    }

    // 3. 添加 token
    const userStore = useUserStore();
    if (userStore.accessToken) {
      config.headers[tokenName] = userStore.accessToken;
    }

    // ... 其他现有的请求拦截逻辑
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

### 步骤 5: 创建环境变量文件

**文件**: `.env.development`

```bash
# 开发环境配置

# 真实后端 API 地址
VUE_APP_API_BASE_URL=http://localhost:3000/api

# 是否启用 Mock（可选，默认从 mock.config.js 读取）
# VUE_APP_ENABLE_MOCK=true
```

**文件**: `.env.production`

```bash
# 生产环境配置

# 真实后端 API 地址
VUE_APP_API_BASE_URL=https://api.yourdomain.com

# 生产环境通常禁用 Mock
# VUE_APP_ENABLE_MOCK=false
```

---

## 📖 使用指南

### 场景 1: 全部使用 Mock（默认）

```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: true,
  mockMode: 'all',
  // ...
};
```

### 场景 2: 白名单模式（推荐）

只有指定的接口使用 Mock，其他调用真实后端：

```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  mockWhiteList: [
    '/vab-mock-server/user/login',    // 登录使用 Mock
    '/vab-mock-server/table/*',       // 表格数据使用 Mock
  ],
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
};
```

### 场景 3: 黑名单模式

除了指定的接口，其他都使用 Mock：

```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: true,
  mockMode: 'blacklist',
  mockBlackList: [
    '/vab-mock-server/product/*',     // 商品接口调用真实后端
    '/vab-mock-server/order/*',       // 订单接口调用真实后端
  ],
};
```

### 场景 4: 完全禁用 Mock

```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: false,  // 所有请求都调用真实后端
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
};
```

### 场景 5: 在 API 定义中强制指定

```javascript
// src/api/user.js
import request from '@/utils/request';
import { markAsMock, markAsReal } from '@/utils/mockInterceptor';

// 强制使用 Mock
export function getUserList() {
  return request({
    url: '/vab-mock-server/user/list',
    method: 'get',
    ...markAsMock()  // 无论配置如何，都使用 Mock
  });
}

// 强制使用真实 API
export function createOrder(data) {
  return request({
    url: '/vab-mock-server/order/create',
    method: 'post',
    data,
    ...markAsReal()  // 无论配置如何，都调用真实后端
  });
}
```

---

## 🎨 控制台输出示例

当 `debug: true` 时，控制台会显示：

```
[Mock] /vab-mock-server/user/login          (绿色 - 使用 Mock)
[Real API] /vab-mock-server/product/list    (蓝色 - 调用真实后端)
[Mock] /vab-mock-server/table/getList       (绿色 - 使用 Mock)
```

---

## ⚙️ 配置优先级

```
强制标记 (markAsMock/markAsReal)
    ↓
全局开关 (enableMock: false)
    ↓
白名单/黑名单规则 (mockWhiteList/mockBlackList)
    ↓
默认模式 (mockMode)
```

---

## 🔍 调试技巧

### 1. 查看当前配置

在浏览器控制台输入：

```javascript
import mockConfig from '@/config/mock.config';
console.table({
  '启用Mock': mockConfig.enableMock,
  '模式': mockConfig.mockMode,
  '调试': mockConfig.debug,
});
```

### 2. 临时切换模式

```javascript
// 在浏览器控制台临时禁用 Mock
localStorage.setItem('FORCE_DISABLE_MOCK', 'true');
location.reload();

// 恢复
localStorage.removeItem('FORCE_DISABLE_MOCK');
location.reload();
```

### 3. 网络面板过滤

在 Chrome DevTools Network 面板中：
- 过滤 Mock 请求: `url:vab-mock-server`
- 过滤真实 API: `-url:vab-mock-server`

---

## 📝 注意事项

### 1. URL 路径处理

Mock Server 的 URL 通常包含 `/vab-mock-server/` 前缀，真实后端可能不需要。拦截器会自动处理这个差异。

### 2. 认证方式

真实后端可能使用不同的认证方式（如 JWT、OAuth），需要在拦截器中相应调整。

### 3. 响应格式

确保 Mock 数据和真实后端的响应格式一致，特别是：
- 状态码字段名
- 数据字段名
- 错误信息格式

### 4. 跨域问题

真实后端需要配置 CORS，或在 `rspack.config.js` 中配置代理：

```javascript
// rspack.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

---

## 🚀 快速开始

### 1. 创建配置文件

```bash
# 创建 Mock 配置
touch src/config/mock.config.js

# 创建拦截器
touch src/utils/mockInterceptor.js

# 创建环境变量
touch .env.development
touch .env.production
```

### 2. 复制配置内容

将上述代码复制到对应文件中。

### 3. 修改 request.js

在 `src/utils/request.js` 的请求拦截器中添加 Mock 拦截逻辑。

### 4. 配置白名单

根据你的需求，在 `mock.config.js` 中配置 `mockWhiteList`。

### 5. 启动项目

```bash
npm run dev
```

### 6. 验证

打开浏览器控制台，查看请求日志，确认 Mock 和真实 API 的切换是否正确。

---

## 🎯 最佳实践

### 1. 开发阶段

- 使用**白名单模式**
- 稳定的接口使用 Mock
- 正在开发的接口调用真实后端

### 2. 联调阶段

- 逐步将接口从白名单移除
- 保留登录、权限等基础接口的 Mock

### 3. 测试阶段

- 使用**黑名单模式**
- 只有特殊场景才使用 Mock

### 4. 生产环境

- 完全禁用 Mock (`enableMock: false`)
- 或使用环境变量控制

---

## 📚 扩展功能

### 1. 延迟模拟

```javascript
// src/utils/mockInterceptor.js
export function mockRequestInterceptor(config) {
  // ...
  
  if (useMock && mockConfig.mockDelay) {
    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => resolve(config), mockConfig.mockDelay);
    });
  }
  
  return config;
}
```

### 2. 错误模拟

```javascript
// mock.config.js
mockConfig.errorSimulation = {
  enabled: false,
  rate: 0.1,  // 10% 的请求返回错误
  errorCode: 500,
};
```

### 3. 数据缓存

```javascript
// 缓存 Mock 响应，提高性能
const mockCache = new Map();

export function getCachedMockData(url) {
  return mockCache.get(url);
}
```

---

## 🐛 常见问题

### Q1: 修改配置后不生效？

**A**: 需要重启开发服务器：
```bash
# Ctrl + C 停止
npm run dev
```

### Q2: 真实 API 返回 404？

**A**: 检查：
1. `realApiConfig` 中的地址是否正确
2. URL 路径是否正确（是否需要移除 `/vab-mock-server/` 前缀）
3. 后端服务是否启动

### Q3: 如何知道当前请求使用的是 Mock 还是真实 API？

**A**: 
1. 查看控制台日志（需要 `debug: true`）
2. 查看 Network 面板的 Request URL
3. 查看响应头中的自定义标识

### Q4: 白名单和黑名单可以同时使用吗？

**A**: 不建议。选择一种模式即可：
- 大部分使用 Mock → 黑名单模式
- 大部分使用真实 API → 白名单模式

---

## 📞 技术支持

如有问题，请查看：
1. 浏览器控制台的错误信息
2. Network 面板的请求详情
3. 本文档的"常见问题"部分

---

**最后更新**: 2026-01-13
**版本**: 1.0.0
**作者**: AI Assistant
