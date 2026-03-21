import { accessTokenService, type AccessToken } from './accessToken'
import { authApi } from './api'

export const authService = {
  async login(login: string, password: string) {
    const responseData = await authApi.auth({ login, password })

    if (responseData?.accessToken) {
      accessTokenService.set(responseData.accessToken)
      return true
    } else {
      return false
    }
  },

  async registration(login: string, password: string) {
    const responseData = await authApi.registration({ login, password })

    if (responseData?.accessToken) {
      accessTokenService.set(responseData.accessToken)
      return true
    } else {
      return false
    }
  },
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
    if (response?.accessToken) {
      accessTokenService.set(response.accessToken)
      return response.accessToken
    } else {
      return null
    }
  },

  logout() {
    accessTokenService.clear()
  },
}
