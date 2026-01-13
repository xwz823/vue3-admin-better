# Vuex 到 Pinia 迁移指南

> 作者: xwz  
> 日期: 2026-01-13

## ✅ 已完成的迁移

### 1. 安装 Pinia
- ✅ 已在 `package.json` 中将 `vuex` 替换为 `pinia`
- ✅ 需要运行 `pnpm install` 安装依赖

### 2. 创建 Pinia Stores
已创建以下 store 文件：
- ✅ `src/stores/user.js` - 用户状态管理
- ✅ `src/stores/routes.js` - 路由状态管理
- ✅ `src/stores/settings.js` - 设置状态管理
- ✅ `src/stores/tabsBar.js` - 标签页状态管理
- ✅ `src/stores/index.js` - 统一导出

### 3. 更新核心文件
- ✅ `src/main.js` - 使用 Pinia 替代 Vuex
- ✅ `src/utils/request.js` - 更新 store 使用方式
- ✅ `src/config/permission.js` - 更新路由守卫中的 store 使用

## 🔄 需要手动更新的组件

以下组件中使用了 Vuex store，需要手动更新为 Pinia：

### 组件更新模式

#### Vuex 用法：
```javascript
// 旧的 Vuex 方式
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['username', 'avatar']),
  },
  methods: {
    ...mapActions('user', ['logout']),
    handleLogout() {
      this.$store.dispatch('user/logout')
    }
  }
}
```

#### Pinia 用法：
```javascript
// 新的 Pinia 方式
import { useUserStore } from '@/stores'

export default {
  setup() {
    const userStore = useUserStore()
    
    return {
      username: computed(() => userStore.username),
      avatar: computed(() => userStore.avatar),
      handleLogout: () => userStore.logout()
    }
  }
}

// 或者在 <script setup> 中
<script setup>
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
}
</script>
```

### 需要更新的文件列表

1. **`src/views/login/index.vue`**
   - 使用: `store.dispatch('user/login')`
   - 改为: `userStore.login()`

2. **`src/layouts/components/VabAvatar/index.vue`**
   - 使用: `mapGetters('user', ['username', 'avatar'])`
   - 使用: `mapActions('user', ['logout'])`
   - 改为使用 `useUserStore()`

3. **`src/layouts/components/VabNav/index.vue`**
   - 使用: `mapGetters('user', [...])`
   - 改为使用 `useUserStore()`

4. **`src/layouts/components/VabSide/index.vue`**
   - 使用: `mapGetters('routes', ['routes'])`
   - 改为使用 `useRoutesStore()`

5. **`src/layouts/components/VabTabs/index.vue`**
   - 使用: `mapGetters('tabsBar', ['visitedRoutes'])`
   - 使用: `mapActions('tabsBar', [...])`
   - 改为使用 `useTabsBarStore()`

6. **`src/layouts/components/VabTop/index.vue`**
   - 使用: `mapGetters('settings', [...])`
   - 使用: `mapActions('settings', [...])`
   - 改为使用 `useSettingsStore()`

7. **`src/layouts/index.vue`**
   - 使用: `mapGetters('settings', [...])`
   - 改为使用 `useSettingsStore()`

8. **`src/views/401.vue` 和 `src/views/404.vue`**
   - 使用: `mapGetters`
   - 改为使用相应的 store

9. **`src/utils/permission.js`**
   - 如果有使用 store，需要更新

## 📝 更新步骤

### 步骤 1: 安装依赖
```bash
pnpm install
```

### 步骤 2: 逐个更新组件

对于每个使用 Vuex 的组件：

1. 移除 Vuex 导入：
   ```javascript
   // 删除
   import { mapGetters, mapActions, mapState } from 'vuex'
   ```

2. 导入 Pinia store：
   ```javascript
   // 添加
   import { useUserStore, useSettingsStore } from '@/stores'
   ```

3. 在 `setup()` 或 `<script setup>` 中使用：
   ```javascript
   const userStore = useUserStore()
   const settingsStore = useSettingsStore()
   ```

4. 更新数据访问：
   ```javascript
   // Vuex: this.$store.state.user.username
   // Pinia: userStore.username
   
   // Vuex: this.$store.getters['user/username']
   // Pinia: userStore.username
   ```

5. 更新方法调用：
   ```javascript
   // Vuex: this.$store.dispatch('user/login', data)
   // Pinia: userStore.login(data)
   
   // Vuex: this.$store.commit('user/setUsername', name)
   // Pinia: userStore.setUsername(name)
   ```

### 步骤 3: 删除旧的 Vuex 代码

完成所有组件更新后：
```bash
# 删除 Vuex store 目录
rm -rf src/store
```

### 步骤 4: 测试

1. 启动项目：
   ```bash
   npm run dev
   ```

2. 测试功能：
   - ✅ 登录功能
   - ✅ 用户信息显示
   - ✅ 路由权限
   - ✅ 标签页操作
   - ✅ 设置修改

## 🎯 Pinia 的优势

1. **更简单的 API**
   - 不需要 mutations
   - 不需要 modules
   - 直接修改 state

2. **更好的 TypeScript 支持**
   - 自动类型推导
   - 更好的 IDE 提示

3. **更小的包体积**
   - 比 Vuex 更轻量

4. **更符合 Vue 3 的设计理念**
   - 使用 Composition API
   - 更直观的使用方式

## 📚 参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [从 Vuex 迁移到 Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)

---

**迁移完成后，项目将使用更现代、更简洁的状态管理方案！** 🎉
