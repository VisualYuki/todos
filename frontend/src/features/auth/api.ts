import { requestor } from '@/shared/api/requestor'
import type { AccessToken } from './accessToken'

export const authApi = {
  async login(data: { login: string; password: string }) {
    return await requestor.post<AccessToken>('/auth/login', {
      login: data.login,
      password: data.password,
    })
  },
  async refreshToken() {
    // return await requestor.post<AccessToken>('/auth/refresh')
  },
}
