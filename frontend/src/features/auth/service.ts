//import { axiosInstance } from '@/plugins/axios'
//import type { AxiosResponse } from 'axios'
import { accessTokenService, type AccessToken } from './accessToken'
//import router from '@/router'
import { requestor } from '@/shared/api/requestor'

export const authService = {
  auth(login: string, password: string) {
    requestor.post('/api/auth', {
      login: login,
      password: password,
    })

    // axiosInstance
    //   .post('/auth', {
    //     login: login,
    //     password: password,
    //   })
    //   .then((response: AxiosResponse<{ accessToken: AccessToken }>) => {
    //     if (response.data.accessToken) {
    //       updateAuthData(response.data.accessToken)

    //       router.push('/main')
    //     }
    //   })
  },

  // async isAuth() {
  //   const token = accessTokenService.get()

  //   if (token !== undefined && !accessTokenService.isExpired()) {
  //     return true
  //   } else {
  //     const refreshToken = await this.refreshAccessToken()

  //     return refreshToken !== null
  //   }
  // },

  // async refreshAccessToken(): Promise<AccessToken | null> {
  //   try {
  //     const response = await requestor.post<{ accessToken: AccessToken }>('/auth/refresh')
  //     if (response.data.accessToken) {
  //       updateAuthData(response.data.accessToken)
  //       return response.data.accessToken
  //     }
  //     return null
  //   } catch (error) {
  //     return null
  //   }
  // },

  // logout() {
  //   console.log('logout')
  // },
}

function updateAuthData(token: AccessToken) {
  accessTokenService.set(token)
}
