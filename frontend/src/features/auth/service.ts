import router from '@/core/router'
import { accessTokenService, type AccessToken } from './accessToken'
import { authApi } from './api'

export const authService = {
  async login(login: string, password: string) {
    const responseData = await authApi.login({ login, password })

    if (responseData) {
      accessTokenService.set(responseData)
      return true
    } else {
      return false
    }
  },
  async signup(login: string, password: string) {},
  async auth() {
    if (!authService.isAuth()) {
      return await this.refreshAccessToken()
    }
  },
  setAccessToken(accessToken: AccessToken) {
    accessTokenService.set(accessToken)
  },

  isAuth() {
    const token = accessTokenService.get()

    if (token !== undefined && !accessTokenService.isExpired()) {
      return true
    } else {
      return false
    }
  },

  async refreshAccessToken(): Promise<AccessToken | null> {
    const response = await authApi.refreshToken()
    if (response) {
      accessTokenService.set(response)

      return response
    } else {
      //router.push({ name: 'login' })
      return null
    }
  },

  // logout() {
  //   console.log('logout')
  // },
}

// function updateAuthData(token: AccessToken) {
//   accessTokenService.set(token)
// }
