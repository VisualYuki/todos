import { requestor } from '@/shared/api/requestor'
import type { AccessToken } from './accessToken'

type AuthResponse = { accessToken: AccessToken }

export const authApi = {
  async auth(data: { login: string; password: string }) {
    return await requestor.post<AuthResponse>('/auth/login', {
      login: data.login,
      password: data.password,
    })
  },
  async registration(data: { login: string; password: string }) {
    return await requestor.post<AuthResponse>('/auth/registration', {
      login: data.login,
      password: data.password,
    })
  },
  async refreshToken() {
    return await requestor.post<AuthResponse>('/auth/refresh')
  },
}
