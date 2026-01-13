/**
 * @description 3个子配置，通用配置|主题配置|网络配置导出
 */
import setting from './setting.config'
import theme from './theme.config'
import network from './net.config'

const config = Object.assign({}, setting, theme, network)

// 默认导出
export default config

// 命名导出（支持解构导入）
export const {
  outputDir,
  assetsDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  copyright,
  footerCopyright,
  progressBar,
  keepAliveMaxNum,
  routerMode,
  routesWhiteList,
  loadingText,
  tokenName,
  tokenTableName,
  storage,
  recordRoute,
  logo,
  errorLog,
  loginInterception,
  authentication,
  uniqueOpened,
  defaultOopeneds,
  debounce,
  providePlugin,
  templateFolder,
  donation,
  header,
  layout,
  themeBar,
  tabsBar,
  publicPath,
  baseURL,
  contentType,
  messageDuration,
  requestTimeout,
  successCode,
  invalidCode,
  noPermissionCode,
} = config
