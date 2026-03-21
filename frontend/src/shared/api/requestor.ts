import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
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

type RequestBody = Record<string, string | number | boolean | undefined>

export const requestor = {
  async makeRequest<data>(
    method: REQUEST_METHOD,
    url: string,
    data?: RequestBody
  ) {
    const requestConfig: AxiosRequestConfig = { headers: {} }

    requestConfig.url = url
    requestConfig.method = method.toLowerCase()

    if (accessTokenService.isExpired()) {
      const accessToken = await this.refreshToken()

      if (accessToken) {
        authService.setAccessToken(accessToken)
      }
    }

    requestConfig['data'] = data

    const token = accessTokenService.get()
    if (token) {
      requestConfig.headers = requestConfig.headers ?? {}
      requestConfig.headers['Authorization'] = token.token
    }

    return await axiosInstance<ApiResponse<data>>(requestConfig)
      .then(async (response) => {
        return response.data.data
      })
      .catch(async (error: AxiosError<ApiResponse>) => {
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

  async post<data>(url: string, data: RequestBody = {}) {
    return await this.makeRequest<data>(REQUEST_METHOD.POST, url, data)
  },

  async refreshToken(): Promise<AccessToken | false> {
    return await axiosInstance<ApiResponse<{ accessToken: AccessToken }>>({
      url: '/auth/refresh',
      method: 'POST',
    })
      .then(async (response) => {
        return response.data.data?.accessToken ?? false
      })
      .catch((): AccessToken | false => {
        return false
      })
  },
}
