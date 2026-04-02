import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
//import { accessTokenService } from './accessToken'
//import type { ResponseTemplate } from '@/types'
//import { authService } from './auth'
import router from '@/core/router'
import type { ApiResponse } from './types'
import { accessTokenService, type AccessToken } from '@/features/auth/accessToken'
import { authService } from '@/features/auth/service'

enum REQUEST_METHOD {
  //GET = 'GET',
  POST = 'POST',
  // PUT = 'PUT',
  //PATCH = 'PATCH',
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:1865',
  withCredentials: true,
})

export const requestor = {
  async makeRequest<data>(method: REQUEST_METHOD, url: string, data?: { [index: string]: string }) {
    const requestConfig: AxiosRequestConfig = { headers: {} }

    requestConfig.url = url
    requestConfig.method = method.toLowerCase()

    // if (accessTokenService.isExpired()) {
    //   const accessToken = await this.refreshToken()

    //   if (accessToken) {
    //     authService.setAccessToken(accessToken)

    //     //if(route)
    //   }
    // }

    // const isAccessTokenSet = await setAccessToken(requestConfig)

    //debugger
    // if (router.currentRoute.value.path !== '/auth') {
    //   router.push('/auth')
    // }

    // if (!isAccessTokenSet) {
    //   return
    // }

    requestConfig['data'] = data

    return await axiosInstance<ApiResponse<data>>(requestConfig)
      .then(async (response) => {
        debugger
        return response.data.data
      })
      .catch(async (error: AxiosError<ApiResponse>) => {
        debugger
        if (error.response) {
          // showNotification(
          //   response.response.config.url,
          //   response.response.data.error,
          //   'error',
          //   true,
          // )
        } else {
          console.log('А почему нет response???')
        }

        //return error
        return undefined
        //throw new Error('fgfg')

        //return response.response?.data || {data: null, error: true, message: ''}
      })
  },

  async post<data>(url: string, data = {}) {
    return await this.makeRequest<data>(REQUEST_METHOD.POST, url, data)
  },

  async refreshToken() {
    // return await axiosInstance<ApiResponse<AccessToken>>({ url: '/auth/refresh', method: 'POST' })
    //   .then(async (response) => {
    //     return response.data.data
    //   })
    //   .catch(async (error: AxiosError<ApiResponse>) => {
    //     return false
    //     //throw new Error('fgfg')
    //     //return response.response?.data || {data: null, error: true, message: ''}
    //   })
  },
}
