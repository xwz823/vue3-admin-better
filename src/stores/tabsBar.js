/**
 * @author xwz
 * @description 标签页状态管理 - Pinia 版本
 */

import { defineStore } from 'pinia'

export const useTabsBarStore = defineStore('tabsBar', {
  state: () => ({
    visitedRoutes: [],
  }),

  getters: {
    // 获取所有访问过的路由
    allVisitedRoutes: (state) => state.visitedRoutes,
  },

  actions: {
    addVisitedRoute(route) {
      let target = this.visitedRoutes.find((item) => item.path === route.path)
      if (target) {
        if (route.fullPath !== target.fullPath) Object.assign(target, route)
        return
      }
      this.visitedRoutes.push(Object.assign({}, route))
    },

    delVisitedRoute(route) {
      this.visitedRoutes.forEach((item, index) => {
        if (item.path === route.path) this.visitedRoutes.splice(index, 1)
      })
      return [...this.visitedRoutes]
    },

    delOthersVisitedRoute(route) {
      this.visitedRoutes = this.visitedRoutes.filter(
        (item) => item.meta.affix || item.path === route.path
      )
      return [...this.visitedRoutes]
    },

    delLeftVisitedRoute(route) {
      let index = this.visitedRoutes.length
      this.visitedRoutes = this.visitedRoutes.filter((item) => {
        if (item.name === route.name) index = this.visitedRoutes.indexOf(item)
        return item.meta.affix || index <= this.visitedRoutes.indexOf(item)
      })
      return [...this.visitedRoutes]
    },

    delRightVisitedRoute(route) {
      let index = this.visitedRoutes.length
      this.visitedRoutes = this.visitedRoutes.filter((item) => {
        if (item.name === route.name) index = this.visitedRoutes.indexOf(item)
        return item.meta.affix || index >= this.visitedRoutes.indexOf(item)
      })
      return [...this.visitedRoutes]
    },

    delAllVisitedRoutes() {
      this.visitedRoutes = this.visitedRoutes.filter((item) => item.meta.affix)
      return [...this.visitedRoutes]
    },

    updateVisitedRoute(route) {
      this.visitedRoutes.forEach((item) => {
        if (item.path === route.path) item = Object.assign(item, route)
      })
    },

    // 组合方法
    async delRoute(route) {
      const visitedRoutes = this.delVisitedRoute(route)
      return { visitedRoutes }
    },

    async delOthersRoutes(route) {
      const visitedRoutes = this.delOthersVisitedRoute(route)
      return { visitedRoutes }
    },

    async delLeftRoutes(route) {
      const visitedRoutes = this.delLeftVisitedRoute(route)
      return { visitedRoutes }
    },

    async delRightRoutes(route) {
      const visitedRoutes = this.delRightVisitedRoute(route)
      return { visitedRoutes }
    },

    async delAllRoutes() {
      const visitedRoutes = this.delAllVisitedRoutes()
      return { visitedRoutes }
    },
  },
})
