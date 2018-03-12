/* global store */
import axios from 'axios'

const SESSION_TIMEOUT = 10000

const sessionBuilder = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: SESSION_TIMEOUT,
    // headers: {'X-Custom-Header':'foobar'}
  })

  instance.interceptors.request.use((config) => {
    const state = store.getState()
    if (state.account.authToken) {
      config.headers.Authorization = state.account.authToken
    }
    return config
  }, err => {
    console.log(err)
    return Promise.reject(err)
  })

  // DEBUG && API请求响应中间件 - 记录组件
  instance.interceptors.response.use((response) => {
    const { config } = response
    const { url, method, baseURL } = config

    if (baseURL === 'http://location-dev.dacsee.io/api/') return response
    console.log(`[SESSION][${method.toUpperCase()}][${url}]`, response)
    return response
  }, (err) => {
    if ('config' in err) {
      const { url, method, baseURL } = err.config
      const { data, status } = err.response
      console.log(`[SESSION][${method.toUpperCase()}][${url}][${status}][${data.code}]`, err.response)
    } else {
      console.log(err)
    }
    return Promise.reject(err)
  })

  // API请求响应中间件 - 数据结构解析
  instance.interceptors.response.use((response) => {
    return { data: response.data }
  }, (err) => {
    return Promise.reject(err)
  })

  return {
    post: async (path: string, body = {}) => {
      const response = await instance.post(`${path}`, body)
      return response
    },
  
    get: async (path: string, body = {}, params = {}) => {
      const response = await instance.get(`${path}`, Object.assign({}, body, { params }))
      return response
    },
  
    put: async (path: string, body = {}) => {
      const response = await instance.put(`${path}`, body)
      return response
    },
  }
}

export default {
  user: sessionBuilder(
    'http://user-dev.dacsee.io/api/'
  ),

  circle: sessionBuilder(
    'http://circle-dev.dacsee.io/api/'
  ),

  booking: sessionBuilder(
    'http://booking-dev.dacsee.io/api/'
  ),

  location: sessionBuilder(
    'http://location-dev.dacsee.io/api/'
  ),

  driver: sessionBuilder(
    'http://driver-verification-dev.dacsee.io/api/'
  ),

  push: sessionBuilder(
    'http://push-dev.dacsee.io/api/'
  ),

  lookup: sessionBuilder(
    'https://lookup-dev.dacsee.io/api/'
  ),

  wallet: sessionBuilder(
    'https://wallet-dev.dacsee.io/api/'
  )
}

