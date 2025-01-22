import axios, { AxiosError, AxiosProgressEvent, AxiosResponse } from 'axios'

import { isEmpty } from 'lodash'
import queryString from 'query-string'
import { router } from '~screens'
import { select } from 'redux-saga/effects'
import { toastServices } from '~utils'
import { userProfileState } from '~redux'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_END_POINT,
  timeout: 10000,
})

const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
}
axiosInstance.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString()
    console.groupCollapsed(
      `${colors.blue}[${timestamp}] - [REQUEST]: ${config.method?.toUpperCase()} ${config.url}${colors.reset
      }`,
    )
    console.log(`${colors.yellow}Method:${colors.reset}`, config.method)
    console.log(`${colors.yellow}URL:${colors.reset}`, config.url)
    console.log(`${colors.yellow}Headers:${colors.reset}`, config.headers)
    console.log(`${colors.yellow}Data:${colors.reset}`, config.data)
    console.groupEnd()
    return config
  },
  (error) => {
    const timestamp = new Date().toISOString()
    console.error(`${colors.red}[${timestamp}] - [REQUEST ERROR]: ${colors.reset}`, error)
    return Promise.reject(error)
  },
)
axiosInstance.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString()
    console.groupCollapsed(
      `${colors.green}[${timestamp}] - [RESPONSE]: ${response.config.method?.toUpperCase()} ${response.config.url
      }${colors.reset}`,
    )
    console.log(`${colors.yellow}Method:${colors.reset}`, response.config.method)
    console.log(`${colors.yellow}URL:${colors.reset}`, response.config.url)
    console.log(`${colors.yellow}Status:${colors.reset}`, response.status)
    console.log(`${colors.yellow}Data:${colors.reset}`, response.data)
    console.groupEnd()
    return response
  },
  (error) => {
    const timestamp = new Date().toISOString()
    if (error.response) {
      console.groupCollapsed(
        `${colors.red
        }[${timestamp}] - [RESPONSE ERROR]: ${error.response.config.method?.toUpperCase()} ${error.response.config.url
        }${colors.reset}`,
      )
      console.log(`${colors.yellow}Method:${colors.reset}`, error.response.config.method)
      console.log(`${colors.yellow}URL:${colors.reset}`, error.response.config.url)
      console.log(`${colors.yellow}Status:${colors.reset}`, error.response.status)
      console.log(`${colors.yellow}Data:${colors.reset}`, error.response.data)
      console.groupEnd()
    } else if (error.request) {
      console.error(
        `${colors.red}[${timestamp}] - [RESPONSE ERROR] - No response received:${colors.reset}`,
        error.request,
      )
    } else {
      console.error(
        `${colors.red}[${timestamp}] - [RESPONSE ERROR] - Request setup error:${colors.reset}`,
        error.message,
      )
    }
    return Promise.reject(error)
  },
)

interface ApiRequest {
  onUploadProgress?: (percentCompleted: number) => void
  params: any
  url: string
}

function getHeaders(isFormData?: boolean): any {
  const language: string = 'vi'
  const contentType = isFormData ? 'multipart/form-data' : 'application/json'
  return {
    Accept: contentType,
    'Accept-Language': language,
    'Content-Type': contentType,
  }
}

function handleApiError(error: any) {
  if (error instanceof AxiosError) {
    toastServices.error({ content: error?.response?.data?.message })
    if (error?.response?.status === 401) {
      return router.navigate('/signIn')
    }
  }
}

export function* apiGet({ params, url }: ApiRequest) {
  try {
    const headers = getHeaders()
    const { accessToken } = yield select(userProfileState) || {}
    if (accessToken) headers.Authorization = accessToken
    const stringified = !isEmpty(params)
      ? `/?${queryString.stringify(params, { arrayFormat: 'index' })}`
      : ''
    const response: AxiosResponse = yield axiosInstance.get(`${url}${stringified}`, { headers })
    return response
  } catch (error: any) {
    yield handleApiError(error)
    throw error
  }
}

export function* apiPost({ params, url }: ApiRequest) {
  try {
    const headers = getHeaders()
    const { accessToken } = yield select(userProfileState) || {}
    if (accessToken) headers.Authorization = accessToken
    const response: AxiosResponse = yield axiosInstance.post(`${url}`, params, { headers })
    return response
  } catch (error: any) {
    yield handleApiError(error)
    throw error
  }
}

export function* apiPostFormData({ onUploadProgress, params, url }: ApiRequest) {
  try {
    const headers = getHeaders(true)
    const { accessToken } = yield select(userProfileState) || {}
    if (accessToken) headers.Authorization = accessToken
    const response: AxiosResponse = yield axiosInstance.post(`${url}`, params, {
      headers,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          ((progressEvent?.loaded || 0) * 100) / (progressEvent?.total || 1),
        )
        onUploadProgress?.(percentCompleted)
      },
      timeout: 120000,
    })
    return response
  } catch (error: any) {
    yield handleApiError(error)
    throw error
  }
}
