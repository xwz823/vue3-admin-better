/**
 * @author xwz
 * @description 全局设置状态管理 - Pinia 版本
 */

import { defineStore } from 'pinia'
import defaultSettings from '@/config'

const { tabsBar, logo, layout, header, themeBar } = defaultSettings
const theme = JSON.parse(localStorage.getItem('vue-admin-better-theme')) || ''

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    tabsBar: theme.tabsBar || tabsBar,
    logo,
    collapse: false,
    layout: theme.layout || layout,
    header: theme.header || header,
    device: 'desktop',
    themeBar,
  }),

  getters: {
    // Pinia 会自动推导类型，不需要显式声明
  },

  actions: {
    changeLayout(layout) {
      if (layout) this.layout = layout
    },

    changeHeader(header) {
      if (header) this.header = header
    },

    changeTabsBar(tabsBar) {
      if (tabsBar) this.tabsBar = tabsBar
    },

    changeCollapse() {
      this.collapse = !this.collapse
    },

    foldSideBar() {
      this.collapse = true
    },

    openSideBar() {
      this.collapse = false
    },

    toggleDevice(device) {
      this.device = device
    },
  },
})
