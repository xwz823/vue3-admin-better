/**
 * @author xwz
 * @description 用户状态管理 - Pinia 版本
 */

import { defineStore } from 'pinia'
import { getUserInfo, login, logout } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: getAccessToken(),
    username: '',
    avatar: '',
    permissions: [],
  }),

  getters: {
    // Pinia 的 getters 会自动获得类型推导
    hasToken: (state) => !!state.accessToken,
    hasPermissions: (state) => state.permissions && state.permissions.length > 0,
  },

  actions: {
    // Pinia 中不需要 commit，直接修改 state
    setAccessToken(accessToken) {
      this.accessToken = accessToken
      setAccessToken(accessToken)
    },

    setUsername(username) {
      this.username = username
    },

    setAvatar(avatar) {
      this.avatar = avatar
    },

    setPermissions(permissions) {
      this.permissions = permissions
    },

    async login(userInfo) {
      const { data } = await login(userInfo)
      const accessToken = data[tokenName]
      if (accessToken) {
        this.setAccessToken(accessToken)
        const hour = new Date().getHours()
        const thisTime =
          hour < 8
            ? '早上好'
            : hour <= 11
            ? '上午好'
            : hour <= 13
            ? '中午好'
            : hour < 18
            ? '下午好'
            : '晚上好'
        ElMessage.success(`欢迎登录${title}，${thisTime}！`)
      } else {
        ElMessage.error(`登录接口异常，未正确返回${tokenName}...`)
      }
    },

    async getUserInfo() {
      try {
        const { data } = await getUserInfo(this.accessToken)
        if (!data) {
          ElMessage.error('验证失败，请重新登录...')
          return false
        }
        let { permissions, username, avatar } = data
        if (permissions && username && Array.isArray(permissions)) {
          this.setPermissions(permissions)
          this.setUsername(username)
          this.setAvatar(avatar)
          return permissions
        } else {
          ElMessage.error('用户信息接口异常')
          return false
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        ElMessage.error('获取用户信息失败，请重新登录')
        return false
      }
    },

    async logout() {
      await logout(this.accessToken)
      this.resetAccessToken()
      await resetRouter()
      location.reload()
    },

    resetAccessToken() {
      this.permissions = []
      this.accessToken = ''
      removeAccessToken()
    },
  },
})
