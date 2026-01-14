/**
 * @author xwz
 * @description 路由状态管理 - Pinia 版本
 */

import { getRouterList } from '@/api/router'
import { asyncRoutes, constantRoutes } from '@/router'
import { convertRouter, filterAsyncRoutes } from '@/utils/handleRoutes'
import { defineStore } from 'pinia'

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    routes: [],
    partialRoutes: [],
  }),

  getters: {
    // 获取所有路由
    allRoutes: (state) => state.routes,
  },

  actions: {
    /**
     * @description intelligence模式设置路由
     * @param {Array} permissions 权限列表
     * @returns {Array} 可访问的路由
     */
    async setRoutes(permissions) {
      // 根据permissions做路由筛选
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      this.routes = constantRoutes.concat(accessedRoutes)
      return accessedRoutes
    },

    /**
     * @description all模式设置路由（从后端获取）
     * @returns {Array} 可访问的路由
     */
    async setAllRoutes() {
      try {
        const resp = await getRouterList();
        console.log(resp);
        let { data } = await getRouterList()
        if (!data || !Array.isArray(data)) {
          console.error('后端返回的路由数据格式不正确', data)
          data = []
        }

        const accessedRoutes = convertRouter(data)
        this.routes = constantRoutes.concat(accessedRoutes)
        return accessedRoutes
      } catch (error) {
        console.error('获取路由列表失败', error)
        this.routes = constantRoutes
        return []
      }
    },
  },
})
