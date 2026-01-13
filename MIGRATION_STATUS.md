# Vuex 到 Pinia 迁移状态

> 作者: xwz  
> 日期: 2026-01-13  
> 状态: 🟡 部分完成

## ✅ 已完成的工作

### 1. 核心配置 (100%)
- ✅ 安装 Pinia 依赖 (`package.json`)
- ✅ 创建所有 Pinia stores (`src/stores/`)
- ✅ 更新 `src/main.js` 使用 Pinia
- ✅ 更新 `src/utils/request.js`
- ✅ 更新 `src/config/permission.js`
- ✅ 更新 `src/views/login/index.vue`

### 2. 创建的 Pinia Stores
```
src/stores/
├── index.js      # 统一导出
├── user.js       # 用户状态
├── routes.js     # 路由状态
├── settings.js   # 设置状态
└── tabsBar.js    # 标签页状态
```

## 🔄 待完成的工作

### 需要手动更新的组件 (共 8 个)

#### 1. `src/layouts/components/VabAvatar/index.vue`
**当前使用:**
```javascript
import { mapGetters, mapActions } from 'vuex'
...mapGetters('user', ['username', 'avatar'])
...mapActions('user', ['logout'])
```

**需要改为:**
```javascript
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// 使用: userStore.username, userStore.avatar, userStore.logout()
```

#### 2. `src/layouts/components/VabNav/index.vue`
- 使用 `mapGetters('user', [...])`
- 改为使用 `useUserStore()`

#### 3. `src/layouts/components/VabSide/index.vue`
- 使用 `mapGetters('routes', ['routes'])`
- 改为使用 `useRoutesStore()`

#### 4. `src/layouts/components/VabTabs/index.vue`
- 使用 `mapGetters('tabsBar', ['visitedRoutes'])`
- 使用 `mapActions('tabsBar', [...])`
- 改为使用 `useTabsBarStore()`

#### 5. `src/layouts/components/VabTop/index.vue`
- 使用 `mapGetters('settings', [...])`
- 使用 `mapActions('settings', [...])`
- 改为使用 `useSettingsStore()`

#### 6. `src/layouts/index.vue`
- 使用 `mapGetters('settings', [...])`
- 改为使用 `useSettingsStore()`

#### 7. `src/views/401.vue`
- 检查是否使用 store

#### 8. `src/views/404.vue`
- 检查是否使用 store

## 📋 完整迁移步骤

### 步骤 1: 安装依赖 ✅
```bash
pnpm install
```

### 步骤 2: 更新组件 (进行中)

对于每个组件，按以下模式更新：

**Options API 组件:**
```javascript
// 旧代码
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['username']),
  },
  methods: {
    ...mapActions('user', ['logout']),
  }
}

// 新代码
import { useUserStore } from '@/stores'

export default {
  setup() {
    const userStore = useUserStore()
    
    return {
      username: computed(() => userStore.username),
      logout: () => userStore.logout()
    }
  }
}
```

**Composition API 组件:**
```javascript
// 旧代码
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('user/login', data)

// 新代码
import { useUserStore } from '@/stores'
const userStore = useUserStore()
userStore.login(data)
```

### 步骤 3: 删除旧代码 (待完成)
```bash
# 完成所有组件更新后执行
rm -rf src/store
```

### 步骤 4: 测试 (待完成)
- [ ] 登录功能
- [ ] 用户信息显示
- [ ] 路由权限
- [ ] 标签页操作
- [ ] 设置修改
- [ ] 退出登录

## 🚀 快速更新命令

### 查找所有使用 Vuex 的文件
```bash
# Windows PowerShell
Get-ChildItem -Path src -Recurse -Filter *.vue | Select-String "mapGetters|mapActions|useStore" | Select-Object -Property Path -Unique

# Linux/Mac
grep -r "mapGetters\|mapActions\|useStore" src --include="*.vue" -l
```

### 批量替换导入语句
```bash
# 将 'vuex' 替换为 '@/stores'
# 需要手动处理，因为每个文件的使用方式不同
```

## 📊 迁移进度

| 类别 | 完成 | 总数 | 进度 |
|------|------|------|------|
| 核心配置 | 6 | 6 | 100% |
| Pinia Stores | 4 | 4 | 100% |
| 组件更新 | 1 | 8 | 12.5% |
| 测试 | 0 | 6 | 0% |
| **总计** | **11** | **24** | **45.8%** |

## 💡 注意事项

1. **不要急于删除 Vuex**
   - 在所有组件更新完成前，保留 `src/store` 目录
   - 可以让 Vuex 和 Pinia 共存一段时间

2. **逐个组件测试**
   - 每更新一个组件就测试一次
   - 确保功能正常后再继续

3. **Pinia 的优势**
   - 不需要 mutations，直接修改 state
   - 更好的 TypeScript 支持
   - 更简洁的 API

4. **常见问题**
   - `this.$store` 需要改为 `useXxxStore()`
   - `mapGetters` 需要改为 `computed(() => store.xxx)`
   - `mapActions` 需要改为直接调用 `store.xxx()`

## 🔗 参考资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [从 Vuex 迁移](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [PINIA_MIGRATION_GUIDE.md](./PINIA_MIGRATION_GUIDE.md) - 详细迁移指南

---

**下一步: 继续更新剩余的 8 个组件** 🚀
