# Mock 配置示例集合

## 📋 目录

1. [基础配置](#基础配置)
2. [开发场景配置](#开发场景配置)
3. [高级配置](#高级配置)
4. [实战案例](#实战案例)

---

## 基础配置

### 示例 1：全部使用 Mock（默认模式）

```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: true,
  mockMode: 'all',
  debug: true,
};
```

**适用场景**：
- ✅ 后端接口尚未开发
- ✅ 前端独立开发阶段
- ✅ 演示和原型展示

---

### 示例 2：完全禁用 Mock

```javascript
const mockConfig = {
  enableMock: false,
  realApiConfig: {
    development: 'http://localhost:3000/api',
    production: 'https://api.yourdomain.com',
  },
  debug: true,
};
```

**适用场景**：
- ✅ 后端接口已全部完成
- ✅ 正式联调阶段
- ✅ 生产环境部署

---

### 示例 3：白名单模式（推荐）

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  mockWhiteList: [
    // 基础接口使用 Mock
    '/vab-mock-server/user/login',
    '/vab-mock-server/user/logout',
    '/vab-mock-server/userInfo',
    
    // 所有表格数据使用 Mock
    '/vab-mock-server/table/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
  
  debug: true,
};
```

**适用场景**：
- ✅ 部分接口已完成，部分未完成
- ✅ 逐步联调阶段
- ✅ 需要精确控制哪些接口使用 Mock

---

### 示例 4：黑名单模式

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'blacklist',
  
  mockBlackList: [
    // 这些接口调用真实后端
    '/vab-mock-server/product/*',
    '/vab-mock-server/order/*',
    '/vab-mock-server/payment/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
  
  debug: true,
};
```

**适用场景**：
- ✅ 大部分接口使用 Mock
- ✅ 只有少数接口需要真实数据
- ✅ 测试特定功能

---

## 开发场景配置

### 场景 1：前端独立开发

**需求**：前端完全独立开发，不依赖后端

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'all',
  debug: true,
  
  logStyle: {
    mock: 'color: #67C23A; font-weight: bold; font-size: 14px;',
    real: 'color: #409EFF; font-weight: bold; font-size: 14px;',
  },
};
```

---

### 场景 2：登录联调，其他 Mock

**需求**：登录接口已完成，需要联调；其他功能继续使用 Mock

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'blacklist',
  
  // 只有登录相关接口调用真实后端
  mockBlackList: [
    '/vab-mock-server/user/login',
    '/vab-mock-server/user/logout',
    '/vab-mock-server/user/refresh',
  ],
  
  realApiConfig: {
    development: 'http://localhost:8080/api',
  },
  
  debug: true,
};
```

---

### 场景 3：核心功能联调

**需求**：用户、商品、订单模块联调，其他模块 Mock

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'blacklist',
  
  mockBlackList: [
    // 用户模块
    '/vab-mock-server/user/*',
    
    // 商品模块
    '/vab-mock-server/product/*',
    
    // 订单模块
    '/vab-mock-server/order/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:8080/api',
  },
  
  debug: true,
};
```

---

### 场景 4：测试环境配置

**需求**：测试环境大部分使用真实接口，保留部分 Mock 用于测试

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  // 只保留测试数据使用 Mock
  mockWhiteList: [
    '/vab-mock-server/test/*',
    '/vab-mock-server/demo/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:8080/api',
    test: 'https://test-api.yourdomain.com',
    production: 'https://api.yourdomain.com',
  },
  
  debug: false,  // 测试环境关闭调试日志
};
```

---

## 高级配置

### 示例 1：使用正则表达式匹配

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  mockWhiteList: [
    // 精确匹配
    '/vab-mock-server/user/login',
    
    // 通配符匹配
    '/vab-mock-server/table/*',
    
    // 正则表达式匹配
    /\/user\/\d+\/profile/,           // 匹配 /user/123/profile
    /\/product\/.*\/detail/,           // 匹配 /product/abc/detail
    /\/(list|detail)$/,                // 匹配以 list 或 detail 结尾的
  ],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
  
  debug: true,
};
```

---

### 示例 2：多环境配置

```javascript
const mockConfig = {
  enableMock: process.env.NODE_ENV !== 'production',  // 生产环境禁用
  mockMode: 'whitelist',
  
  mockWhiteList: [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ],
  
  realApiConfig: {
    // 开发环境
    development: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
    
    // 测试环境
    test: 'https://test-api.yourdomain.com',
    
    // 预发布环境
    staging: 'https://staging-api.yourdomain.com',
    
    // 生产环境
    production: 'https://api.yourdomain.com',
  },
  
  debug: process.env.NODE_ENV === 'development',  // 只在开发环境开启调试
};
```

---

### 示例 3：条件配置

```javascript
// 根据不同条件使用不同配置
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

const mockConfig = {
  // 开发环境启用，生产环境禁用
  enableMock: !isProd,
  
  // 开发环境用白名单，测试环境用黑名单
  mockMode: isDev ? 'whitelist' : 'blacklist',
  
  mockWhiteList: isDev ? [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ] : [],
  
  mockBlackList: isTest ? [
    '/vab-mock-server/payment/*',
  ] : [],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
    test: 'https://test-api.yourdomain.com',
    production: 'https://api.yourdomain.com',
  },
  
  debug: isDev || isTest,
};
```

---

### 示例 4：动态配置（从 localStorage 读取）

```javascript
// 支持从浏览器 localStorage 动态控制
const localConfig = JSON.parse(localStorage.getItem('MOCK_CONFIG') || '{}');

const mockConfig = {
  enableMock: localConfig.enableMock !== undefined 
    ? localConfig.enableMock 
    : true,
  
  mockMode: localConfig.mockMode || 'whitelist',
  
  mockWhiteList: localConfig.mockWhiteList || [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ],
  
  realApiConfig: {
    development: localConfig.apiUrl || 'http://localhost:3000/api',
    production: 'https://api.yourdomain.com',
  },
  
  debug: localConfig.debug !== undefined ? localConfig.debug : true,
};

// 在浏览器控制台可以这样修改配置：
// localStorage.setItem('MOCK_CONFIG', JSON.stringify({
//   enableMock: false,
//   apiUrl: 'http://192.168.1.100:8080/api'
// }));
// location.reload();
```

---

## 实战案例

### 案例 1：电商项目配置

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  mockWhiteList: [
    // 用户认证（Mock）
    '/vab-mock-server/user/login',
    '/vab-mock-server/user/logout',
    '/vab-mock-server/userInfo',
    
    // 商品列表（Mock）
    '/vab-mock-server/product/list',
    '/vab-mock-server/product/category',
    
    // 购物车（真实）- 不在白名单中
    // '/vab-mock-server/cart/*',
    
    // 订单（真实）- 不在白名单中
    // '/vab-mock-server/order/*',
    
    // 支付（真实）- 不在白名单中
    // '/vab-mock-server/payment/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:8080/api',
    production: 'https://api.shop.com',
  },
  
  debug: true,
};
```

---

### 案例 2：后台管理系统

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  mockWhiteList: [
    // 基础功能（Mock）
    '/vab-mock-server/user/login',
    '/vab-mock-server/router/getList',
    '/vab-mock-server/icon/getList',
    
    // 表格示例（Mock）
    '/vab-mock-server/table/*',
    '/vab-mock-server/tree/*',
    
    // 数据统计（真实）- 不在白名单中
    // '/vab-mock-server/dashboard/*',
    
    // 用户管理（真实）- 不在白名单中
    // '/vab-mock-server/system/user/*',
    
    // 权限管理（真实）- 不在白名单中
    // '/vab-mock-server/system/role/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
    production: 'https://admin-api.yourdomain.com',
  },
  
  debug: true,
};
```

---

### 案例 3：移动端 H5 项目

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'blacklist',
  
  // 只有这些接口调用真实后端
  mockBlackList: [
    // 用户登录（真实）
    '/vab-mock-server/user/login',
    '/vab-mock-server/user/smsCode',
    
    // 定位服务（真实）
    '/vab-mock-server/location/*',
    
    // 支付相关（真实）
    '/vab-mock-server/payment/*',
  ],
  
  realApiConfig: {
    development: 'http://192.168.1.100:8080/api',
    production: 'https://m-api.yourdomain.com',
  },
  
  debug: true,
};
```

---

### 案例 4：微服务架构

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  mockWhiteList: [
    // 用户服务（Mock）
    '/vab-mock-server/user-service/*',
    
    // 商品服务（真实）- 不在白名单中
    // '/vab-mock-server/product-service/*',
    
    // 订单服务（真实）- 不在白名单中
    // '/vab-mock-server/order-service/*',
    
    // 支付服务（真实）- 不在白名单中
    // '/vab-mock-server/payment-service/*',
  ],
  
  realApiConfig: {
    development: 'http://localhost:8080',  // API 网关地址
    production: 'https://gateway.yourdomain.com',
  },
  
  debug: true,
};
```

---

## 🎨 调试配置

### 彩色日志配置

```javascript
const mockConfig = {
  // ... 其他配置
  
  debug: true,
  
  logStyle: {
    // Mock 请求 - 绿色加粗
    mock: 'color: #67C23A; font-weight: bold; font-size: 14px; background: #f0f9ff; padding: 2px 8px;',
    
    // 真实请求 - 蓝色加粗
    real: 'color: #409EFF; font-weight: bold; font-size: 14px; background: #ecf5ff; padding: 2px 8px;',
    
    // 错误 - 红色加粗
    error: 'color: #F56C6C; font-weight: bold; font-size: 14px; background: #fef0f0; padding: 2px 8px;',
  },
};
```

---

### 详细日志配置

```javascript
const mockConfig = {
  // ... 其他配置
  
  debug: true,
  
  // 自定义日志函数
  customLogger: (url, useMock, config) => {
    console.group(`%c${useMock ? '🟢 Mock' : '🔵 Real API'}`, 
      useMock 
        ? 'color: #67C23A; font-weight: bold;' 
        : 'color: #409EFF; font-weight: bold;'
    );
    console.log('URL:', url);
    console.log('Method:', config.method?.toUpperCase() || 'GET');
    console.log('Headers:', config.headers);
    if (config.data) {
      console.log('Data:', config.data);
    }
    console.groupEnd();
  },
};
```

---

## 💡 最佳实践

### 1. 团队协作配置

```javascript
// 团队成员可以通过环境变量自定义配置
const mockConfig = {
  enableMock: process.env.VUE_APP_ENABLE_MOCK !== 'false',
  mockMode: process.env.VUE_APP_MOCK_MODE || 'whitelist',
  
  mockWhiteList: [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ],
  
  realApiConfig: {
    development: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
  },
  
  debug: true,
};

// 团队成员在本地 .env.local 中配置：
// VUE_APP_ENABLE_MOCK=false
// VUE_APP_API_BASE_URL=http://192.168.1.100:8080/api
```

---

### 2. 分支策略配置

```javascript
// 根据 Git 分支使用不同配置
const branch = process.env.VUE_APP_GIT_BRANCH || 'develop';

const mockConfig = {
  enableMock: branch === 'develop',  // develop 分支启用 Mock
  mockMode: 'whitelist',
  
  mockWhiteList: branch === 'develop' ? [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ] : [],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
    production: 'https://api.yourdomain.com',
  },
  
  debug: branch === 'develop',
};
```

---

### 3. 功能开关配置

```javascript
const mockConfig = {
  enableMock: true,
  mockMode: 'whitelist',
  
  // 按功能模块分组
  mockWhiteList: [
    // 基础功能
    ...getBasicApis(),
    
    // 用户模块
    ...getUserApis(),
    
    // 商品模块（开发中）
    ...getProductApis(),
  ],
  
  realApiConfig: {
    development: 'http://localhost:3000/api',
  },
  
  debug: true,
};

function getBasicApis() {
  return [
    '/vab-mock-server/user/login',
    '/vab-mock-server/router/getList',
  ];
}

function getUserApis() {
  return [
    '/vab-mock-server/user/*',
  ];
}

function getProductApis() {
  // 商品模块开发中，使用 Mock
  return [
    '/vab-mock-server/product/*',
  ];
}
```

---

## 📝 配置模板

### 复制使用模板

```javascript
/**
 * Mock 配置文件
 * 根据项目需求修改配置
 */
const mockConfig = {
  // ========== 基础配置 ==========
  enableMock: true,                    // 是否启用 Mock
  mockMode: 'whitelist',               // 模式: all | whitelist | blacklist
  debug: true,                         // 是否打印日志
  
  // ========== 白名单配置 ==========
  mockWhiteList: [
    // TODO: 添加需要使用 Mock 的接口
    '/vab-mock-server/user/login',
  ],
  
  // ========== 黑名单配置 ==========
  mockBlackList: [
    // TODO: 添加需要调用真实后端的接口
  ],
  
  // ========== 后端地址配置 ==========
  realApiConfig: {
    development: 'http://localhost:3000/api',
    production: 'https://api.yourdomain.com',
  },
  
  // ========== 日志样式配置 ==========
  logStyle: {
    mock: 'color: #67C23A; font-weight: bold;',
    real: 'color: #409EFF; font-weight: bold;',
    error: 'color: #F56C6C; font-weight: bold;',
  },
};

// ========== 匹配规则函数 ==========
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

// ========== 导出函数 ==========
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
  const style = useMock ? mockConfig.logStyle.mock : mockConfig.logStyle.real;
  console.log(`%c[${type}] ${url}`, style);
}

export default mockConfig;
```

---

**配置示例完成！** 🎉

选择适合你项目的配置，复制到 `src/config/mock.config.js` 即可使用。
