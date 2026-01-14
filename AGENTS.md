# Vertex 项目 AI 开发规则

> **作者**: xwz  
> **项目**: vue3-admin-better (Vertex)  
> **技术栈**: Vue 3 + Pinia + Element Plus + Rspack  
> **最后更新**: 2026-01-13

---

## 📋 核心原则

### 1. 最小修改成本
- ✅ 优先使用最小的代码改动解决问题
- ✅ 避免不必要的重构和优化
- ✅ 保持现有代码风格和结构
- ❌ 不要发散思维，专注于当前任务

### 2. 文件管理
- ✅ 说明文档默认存储在 `.vscode` 目录下
- ❌ 不要创建过多不必要的文件
- ❌ 不要生成多余的说明文档、markdown 文档
- ❌ 非主动要求生成说明文档时，不要生成 md 说明文档

### 3. 作者信息
- 所有生成的文件中如果要包含作者，作者是 `xwz`
- 保留原有代码中的 `@author` 注释（如果存在）

---

## 🏗️ 项目结构

```
vue3-admin-better/
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   ├── layouts/          # 布局组件
│   ├── plugins/          # 插件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── mock/                 # Mock 数据
├── public/               # 公共资源
├── .vscode/              # VSCode 配置和说明文档
├── rspack.js             # Rspack 启动脚本
├── rspack.config.js      # Rspack 配置
└── package.json          # 项目依赖
```

---

## 💻 代码规范

### 1. Vue 组件规范

#### **文件命名**
- 组件文件使用 PascalCase：`VabPageHeader.vue`
- 页面文件使用小写：`index.vue`
- 工具文件使用 camelCase：`request.js`

#### **组件结构**
```vue
<template>
  <!-- 模板内容 -->
</template>

<script>
// 使用 Options API（项目当前标准）
export default {
  name: 'ComponentName',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
// 样式内容
</style>
```

#### **注意事项**
- ✅ 项目使用 **Options API**（不是 Composition API）
- ✅ 使用 `<script>` 而不是 `<script setup>`
- ✅ 组件必须有 `name` 属性
- ✅ 样式使用 `lang="scss"` 和 `scoped`

### 2. JavaScript 规范

#### **导入顺序**
```javascript
// 1. Vue 相关
import { createApp } from 'vue'

// 2. 第三方库
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 3. 项目内部模块（使用 @ 别名）
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { title } from '@/config'
```

#### **函数定义**
```javascript
// ✅ 使用 async/await
export async function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

// ✅ 添加 JSDoc 注释
/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  // 函数实现
}
```

#### **导出方式**
```javascript
// ✅ 命名导出（推荐）
export function getUserInfo() {}
export const config = {}

// ✅ 默认导出（用于 Vue 组件和主要模块）
export default router
```

### 3. 样式规范

#### **SCSS 使用**
```scss
// ✅ 使用嵌套
.index-container {
  padding: 0;
  
  .card {
    height: 600px;
    
    .dependency-content {
      display: flex;
    }
  }
}

// ✅ 使用变量（全局变量已自动注入）
.button {
  padding: $base-padding;
  color: $base-color-white;
  border: 1px solid $base-border-color;
}

// ✅ 使用 :deep() 修改子组件样式
:deep() {
  .el-card__body {
    padding: 20px;
  }
}
```

#### **样式组织**
- 全局样式变量在 `src/styles/variables.scss`
- 每个 SCSS 文件自动注入全局变量（无需手动导入）
- 组件样式使用 `scoped`

---

## 🔧 技术栈规范

### 1. 状态管理 - Pinia

#### **Store 定义**
```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    username: '',
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  
  actions: {
    setAccessToken(token) {
      this.accessToken = token
    },
    
    async login(data) {
      // 异步操作
    },
  },
})
```

#### **Store 使用**
```javascript
// 在组件中
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  
  methods: {
    handleLogin() {
      this.userStore.setAccessToken('token')
    }
  }
}
```

### 2. 路由 - Vue Router 4

#### **路由定义**
```javascript
// router/index.js
export const asyncRoutes = [
  {
    path: '/example',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Example',
    meta: { title: '示例', icon: 'box-open' },
    children: [
      {
        path: 'detail',
        name: 'ExampleDetail',
        component: () => import('@/views/example/detail.vue'),
        meta: {
          title: '详情',
          permissions: ['admin'],
        },
      },
    ],
  },
]
```

#### **路由跳转**
```javascript
// ✅ 使用 router.push
this.$router.push({ path: '/example' })
this.$router.push({ name: 'ExampleDetail', params: { id: 1 } })

// ✅ 带查询参数
this.$router.push({ path: '/example', query: { tab: 'info' } })
```

### 3. HTTP 请求 - Axios

#### **API 定义**
```javascript
// api/user.js
import request from '@/utils/request'

export async function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data,
  })
}
```

#### **请求使用**
```javascript
// 在组件中
import { getUserList } from '@/api/user'

export default {
  methods: {
    async fetchData() {
      try {
        const res = await getUserList({ page: 1 })
        this.list = res.data
      } catch (error) {
        console.error('获取用户列表失败:', error)
      }
    }
  }
}
```

### 4. UI 组件 - Element Plus

#### **组件使用**
```vue
<template>
  <el-button type="primary" @click="handleClick">
    点击
  </el-button>
  
  <el-table :data="tableData" stripe>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="age" label="年龄" />
  </el-table>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  methods: {
    handleClick() {
      ElMessage.success('操作成功')
    }
  }
}
</script>
```

---

## 🌍 环境变量

### 1. 环境变量配置

#### **文件位置**
- `.env.development` - 开发环境
- `.env.production` - 生产环境

#### **变量命名规范**
```env
# ✅ 使用 VUE_APP_ 前缀（浏览器环境可用）
VUE_APP_TITLE=Vertex
VUE_APP_AUTHOR=xwz
VITE_API_BASE_URL=http://localhost:8888
VUE_APP_MOCK_ENABLE=true

# ✅ 不使用前缀（仅 Node.js 环境可用）
NODE_ENV=dev
```

### 2. 环境变量使用

#### **在浏览器代码中**
```javascript
// src/**/*.js 或 src/**/*.vue
const title = process.env.VUE_APP_TITLE        // "Vertex"
const apiUrl = process.env.VITE_API_BASE_URL // "http://localhost:3000/api"
const env = process.env.NODE_ENV               // "dev" 或 "prod"
```

#### **在构建配置中**
```javascript
// rspack.config.js 或 rspack.js
const title = process.env.VUE_APP_TITLE
const mode = process.env.NODE_ENV
```

#### **注意事项**
- ✅ 所有环境变量都是**字符串类型**
- ✅ 布尔值需要手动转换：`process.env.VUE_APP_MOCK_ENABLE === 'true'`
- ✅ 新增环境变量需要在 `rspack.config.js` 的 `DefinePlugin` 中注册

---

## 🎨 Mock 数据

### 1. Mock 配置

#### **Mock 控制**
```javascript
// src/config/mock.config.js
const mockConfig = {
  enableMock: true,              // 是否启用 Mock
  mockMode: 'whitelist',         // 模式：whitelist | blacklist | all
  
  mockWhiteList: [
    '/vab-mock-server/user/login',
    '/vab-mock-server/table/*',
  ],
  
  realApiConfig: {
    dev: process.env.VITE_API_BASE_URL || 'http://localhost:8888',
    prod: process.env.VITE_API_BASE_URL || 'https://api.yourdomain.com',
  },
}
```

### 2. Mock 数据定义

#### **文件位置**
- `mock/controller/*.js` - Mock 控制器

#### **Mock 格式**
```javascript
// mock/controller/user.js
const { mock } = require('mockjs')

module.exports = [
  {
    url: '/vab-mock-server/user/login',
    type: 'post',
    response: (req, res) => {
      const { username, password } = req.body
      
      if (username === 'admin' && password === '123456') {
        return res.json({
          code: 200,
          msg: '登录成功',
          data: {
            accessToken: 'admin-token',
            username: 'admin',
          },
        })
      }
      
      return res.json({
        code: 500,
        msg: '用户名或密码错误',
      })
    },
  },
]
```

---

## 🚀 构建和部署

### 1. 启动命令

```bash
# 开发环境（自动加载 .env.development）
npm run dev

# 生产构建（自动加载 .env.production）
npm run build

# 清理依赖并重新安装
npm run clear

# 更新依赖
npm run update
```

### 2. 构建配置

#### **Rspack 配置**
- `rspack.js` - 启动脚本（设置环境变量、启动服务）
- `rspack.config.js` - 构建配置（Loader、Plugin、优化）

#### **关键配置**
```javascript
// rspack.config.js
module.exports = {
  mode: mode,
  entry: { app: './src/main.js' },
  
  resolve: {
    alias: {
      '@': resolve('src'),  // @ 别名指向 src 目录
    },
  },
  
  // SCSS 全局变量自动注入
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: (content) => {
                return `@import "~@/styles/variables.scss";${content}`;
              },
            },
          },
        ],
      },
    ],
  },
}
```

---

## 📝 注释规范

### 1. 文件头注释

```javascript
/**
 * @author xwz
 * @description 文件功能描述
 */
```

### 2. 函数注释

```javascript
/**
 * @description 函数功能描述
 * @param {string} name - 参数说明
 * @param {Object} options - 配置项
 * @returns {Promise<Object>} 返回值说明
 */
async function fetchData(name, options) {
  // 函数实现
}
```

### 3. 复杂逻辑注释

```javascript
// ===== Mock 控制逻辑 =====
// 1. 检查是否有强制标记
const forceMode = checkForceMode(config)

// 2. 根据配置决定使用 Mock 还是真实 API
if (forceMode === 'mock') {
  // 强制使用 Mock
} else {
  // 使用真实 API
}
// ===== Mock 控制逻辑结束 =====
```

---

## ⚠️ 常见问题和注意事项

### 1. 环境变量问题

**问题**: `process is not defined`

**原因**: 在浏览器环境中直接访问 `process` 对象

**解决**: 
- ✅ 使用 `process.env.XXX`（完整路径）
- ❌ 不要单独访问 `process`

### 2. 路径别名问题

**问题**: 无法识别 `@` 别名

**解决**:
```javascript
// ✅ 正确
import router from '@/router'

// ❌ 错误
import router from '../router'  // 不推荐使用相对路径
```

### 3. 样式问题

**问题**: 全局变量未生效

**解决**:
- 全局变量已自动注入，无需手动 `@import`
- 如果不生效，检查 `rspack.config.js` 中的 `sass-loader` 配置

### 4. Mock 数据问题

**问题**: Mock 数据不生效

**解决**:
1. 检查 `src/config/mock.config.js` 中的配置
2. 确认接口 URL 在白名单中
3. 查看控制台 Mock 日志

---

## 🔄 迁移和升级

### 从 Vuex 迁移到 Pinia

```javascript
// ❌ 旧的 Vuex 写法
import { mapState, mapActions } from 'vuex'

computed: {
  ...mapState(['user'])
}

// ✅ 新的 Pinia 写法
import { useUserStore } from '@/stores/user'

setup() {
  const userStore = useUserStore()
  return { userStore }
}
```

### 从 Webpack 迁移到 Rspack

- ✅ 配置文件已迁移完成
- ✅ Loader 配置已适配
- ✅ Plugin 配置已适配
- ⚠️ 如需迁移到 Vite，参考项目文档

---

## 📚 参考资源

### 官方文档
- [Vue 3](https://cn.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [Vue Router 4](https://router.vuejs.org/zh/)
- [Element Plus](https://element-plus.org/zh-CN/)
- [Rspack](https://www.rspack.dev/)

### 项目相关
- [GitHub 仓库](https://github.com/zxwk1998/vue-admin-better)
- [官方网站](https://vuejs-core.cn)

---

## 🎯 AI 开发指引

### 修改代码时

1. **先理解现有代码**
   - 阅读相关文件
   - 理解代码结构和逻辑
   - 遵循现有代码风格

2. **最小化修改**
   - 只修改必要的部分
   - 不要重构无关代码
   - 保持原有结构

3. **测试验证**
   - 确保修改不影响其他功能
   - 检查控制台是否有错误
   - 验证功能是否正常

### 生成文件时

1. **文件位置**
   - 说明文档放在 `.vscode` 目录
   - 代码文件放在对应的功能目录
   - 遵循项目目录结构

2. **文件命名**
   - 遵循项目命名规范
   - 使用有意义的文件名
   - 避免创建重复文件

3. **文件内容**
   - 添加必要的注释
   - 包含作者信息（xwz）
   - 遵循代码规范

### 回答问题时

1. **准确性**
   - 基于项目实际代码回答
   - 不要臆测或猜测
   - 提供具体的代码示例

2. **完整性**
   - 提供完整的解决方案
   - 说明可能的影响
   - 给出注意事项

3. **简洁性**
   - 直接回答问题
   - 避免冗长的解释
   - 重点突出关键信息

---

**最后更新**: 2026-01-13  
**维护者**: xwz  
**版本**: 1.0.0
