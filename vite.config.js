/**
 * @author xwz
 * @description Vite 配置文件
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    // 基础路径
    base: env.VITE_PUBLIC_PATH || '/',

    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_DEV_PORT || '8091'),
      open: false,
      cors: true,
      // 代理配置（如果需要）
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // 预览服务器配置
    preview: {
      port: 8091,
      host: '0.0.0.0',
    },

    // 路径解析
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.esm-bundler.js',
        'path': 'path-browserify',
      },
      extensions: ['.js', '.vue', '.json', '.mjs'],
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          // 全局变量自动注入
          additionalData: (content, loaderContext) => {
            // 避免在 variables.scss 自身中重复导入
            if (loaderContext && loaderContext.includes('variables.scss')) {
              return content
            }
            return `@import "@/styles/variables.scss";${content}`
          },
          // 新版 sass API
          api: 'modern-compiler',
        },
      },
      // CSS Modules 配置
      modules: {
        localsConvention: 'camelCase',
        scopeBehaviour: 'local',
      },
    },

    // 插件配置
    plugins: [
      // Vue 插件
      vue(),

      // HTML 模板插件
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Vertex',
            author: env.VITE_APP_AUTHOR || 'xwz',
          },
        },
      }),

      // Mock 插件
      viteMockServe({
        mockPath: 'mock',
        enable: isDev && env.VITE_APP_MOCK_ENABLE === 'true',
        watchFiles: true,
        logger: true,
      }),

      // Element Plus 自动导入（可选）
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: 'types/auto-imports.d.ts',
      }),

      // Element Plus 组件自动导入（可选）
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'types/components.d.ts',
      }),

      // Gzip 压缩（生产环境）
      isProd &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),

      // 打包分析（生产环境）
      isProd &&
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),

    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: isDev,
      minify: 'terser',
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
      rollupOptions: {
        output: {
          // 代码分割
          manualChunks: {
            // Vue 核心
            vue: ['vue', 'vue-router', 'pinia'],
            // Element Plus
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            // 工具库
            vendors: ['lodash', 'lodash-es', 'axios', 'qs', 'dayjs'],
            // ECharts
            echarts: ['echarts', 'vue-echarts'],
          },
          // 文件命名
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // 根据文件类型分类
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'img'
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `static/${extType}/[name]-[hash].[ext]`
          },
        },
      },
    },

    // 依赖优化
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'lodash',
        'lodash-es',
        'dayjs',
        'echarts',
        'vue-echarts',
        'nprogress',
        'qs',
        'screenfull',
        'mockjs',
        'mitt',
        'vue-demi',
      ],
    },

    // 定义全局常量
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'dev' : 'prod'),
      'process.env.BASE_URL': JSON.stringify(env.VITE_PUBLIC_PATH || '/'),
      'process.env.VUE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE || 'Vertex'),
      'process.env.VUE_APP_AUTHOR': JSON.stringify(env.VITE_APP_AUTHOR || 'xwz'),
      'process.env.VUE_APP_MOCK_ENABLE': JSON.stringify(env.VITE_APP_MOCK_ENABLE || 'true'),
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
      'process.env.VUE_APP_UPDATE_TIME': JSON.stringify(new Date().toLocaleString()),
      'process.env': JSON.stringify({
        NODE_ENV: mode === 'development' ? 'dev' : 'prod',
        BASE_URL: env.VITE_PUBLIC_PATH || '/',
        VUE_APP_TITLE: env.VITE_APP_TITLE || 'Vertex',
        VUE_APP_AUTHOR: env.VITE_APP_AUTHOR || 'xwz',
        VUE_APP_MOCK_ENABLE: env.VITE_APP_MOCK_ENABLE || 'true',
        VITE_API_BASE_URL: env.VITE_API_BASE_URL || '',
        VUE_APP_UPDATE_TIME: new Date().toLocaleString(),
      }),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
  }
})
