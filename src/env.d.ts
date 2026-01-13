/**
 * @author xwz
 * @description 环境变量和全局类型声明
 */

/// <reference types="vite/client" />

// Vue 组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_AUTHOR: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_MOCK_ENABLE: string
  readonly VITE_DEV_PORT: string
  readonly VITE_PUBLIC_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// process.env 类型声明（兼容旧代码）
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'dev' | 'prod'
    readonly BASE_URL: string
    readonly VUE_APP_TITLE: string
    readonly VUE_APP_AUTHOR: string
    readonly VUE_APP_MOCK_ENABLE: string
    readonly VUE_APP_API_BASE_URL: string
    readonly VUE_APP_UPDATE_TIME: string
  }
}

// 常用模块类型声明
declare module 'nprogress' {
  const NProgress: any
  export default NProgress
}

declare module 'screenfull' {
  const screenfull: any
  export default screenfull
}

declare module 'mockjs' {
  const Mock: any
  export default Mock
}

declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor()
    setPublicKey(key: string): void
    encrypt(data: string): string | false
  }
}
