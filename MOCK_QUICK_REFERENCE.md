# Mock 控制 - 快速参考卡片

## 📋 配置文件位置

```
src/config/mock.config.js       # Mock 配置
src/utils/mockInterceptor.js    # Mock 拦截器
src/utils/request.js             # 已修改（添加 Mock 控制）
.env.development                 # 环境变量（需手动创建）
```

---

## 🎯 快速配置

### 全部使用 Mock

```javascript
// src/config/mock.config.js
enableMock: true,
mockMode: 'all',
```

### 白名单模式（推荐）

```javascript
enableMock: true,
mockMode: 'whitelist',
mockWhiteList: [
  '/vab-mock-server/user/login',
  '/vab-mock-server/table/*',
],
```

### 黑名单模式

```javascript
enableMock: true,
mockMode: 'blacklist',
mockBlackList: [
  '/vab-mock-server/product/*',
],
```

### 完全禁用 Mock

```javascript
enableMock: false,
```

---

## 💻 代码中强制指定

```javascript
import { markAsMock, markAsReal } from '@/utils/mockInterceptor';

// 强制使用 Mock
export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get',
    ...markAsMock()
  });
}

// 强制使用真实 API
export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data,
    ...markAsReal()
  });
}
```

---

## 🔍 匹配规则

```javascript
mockWhiteList: [
  '/vab-mock-server/user/login',    // 精确匹配
  '/vab-mock-server/table/*',       // 通配符
  /\/user\/.*\/detail/,              // 正则
]
```

---

## 🎨 控制台输出

```
🟢 [Mock] /vab-mock-server/user/login
🔵 [Real API] /vab-mock-server/product/list
```

---

## 🐛 常见问题

| 问题 | 解决方案 |
|------|----------|
| 配置不生效 | 重启服务器（Ctrl+C → npm run dev） |
| 没有日志 | 检查 `debug: true` |
| 404 错误 | 检查 `.env.development` 中的 API 地址 |
| CORS 错误 | 配置后端 CORS 或使用代理 |

---

## 📚 详细文档

- `.vscode/MOCK_CONTROL_SOLUTION.md` - 完整方案
- `.vscode/MOCK_QUICK_START.md` - 快速开始
- `.vscode/MOCK_CONFIG_EXAMPLES.md` - 配置示例
- `MOCK_SETUP_GUIDE.md` - 安装指南

---

## 🚀 下一步

1. 创建 `.env.development` 文件
2. 配置真实后端地址
3. 调整 `mockWhiteList`
4. 重启服务器
5. 查看控制台日志

---

**快速参考 v1.0** | 2026-01-13
