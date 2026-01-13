/**
 * @author xwz
 * @description 公共布局及样式自动引入（Vite 版本）
 */

// 使用 import.meta.glob 自动导入主题文件（eager: true 表示立即导入）
const themeModules = import.meta.glob('@/styles/themes/**/*.scss', { eager: true })

// 预加载组件，但不立即注册
// 这些组件将在main.js中被注册
const componentModules = import.meta.glob('./components/**/*.vue', { eager: true })

const components = {}
Object.entries(componentModules).forEach(([path, module]) => {
  const component = module.default || module
  if (component.name) {
    components[component.name] = component
  }
})

// 创建一个注册函数，接收app实例
export function registerLayoutComponents(app) {
  // 注册所有布局组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}
