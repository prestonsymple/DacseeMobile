/* global store */
import axios from 'axios'

const SESSION_TIMEOUT = 5000

const sessionBuilder = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: SESSION_TIMEOUT,
    // headers: {'X-Custom-Header':'foobar'}
  })

  instance.interceptors.request.use((config) => {
    const state = store.getState()
    config.headers['Accept-Language'] = 'CN'
    if (state.account.authToken) {
      config.headers.Authorization = state.account.authToken
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  // DEBUG && API请求响应中间件 - 记录组件
  instance.interceptors.response.use((response) => {
    const { config } = response
    const { url, method, baseURL } = config

    if (baseURL === 'http://location-dev.dacsee.io/api/' && method.toUpperCase() === 'PUT') return response
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
    const _response = response || { data: null }
    return { data: _response.data }
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

    delete: async (path: string, body = {}) => {
      const response = await instance.delete(`${path}`, body)
      return response
    },

    upload: async (path: string, data, config) => {
      const response = await instance.post(`${path}`, data, Object.assign({}, {
        header: { 'content-type': 'multipart/form-data' }
      }, config))
      return response
    }
  }
}

const sessionBuilder2 = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: SESSION_TIMEOUT,
    // headers: {'X-Custom-Header':'foobar'}
  })

  instance.interceptors.request.use((config) => {
    const state = store.getState()
    config.headers['Accept-Language'] = 'CN'
    if (state.account.authToken) {
      config.headers.Authorization = state.account.authToken
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  // DEBUG && API请求响应中间件 - 记录组件
  instance.interceptors.response.use((response) => {
    const { config } = response
    const { url, method, baseURL } = config

    if (baseURL === 'http://location-dev.dacsee.io/api/' && method.toUpperCase() === 'PUT') return response
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
    const _response = response || { data: null }
    return _response.data || {}
  }, (err) => {
    return Promise.reject(err)
  })

  return {
    Post: async (path: string, body = {}) => {
      const response = await instance.post(`${path}`, body)
      return response
    },
  
    Get: async (path: string, body = {}, params = {}) => {
      const response = await instance.get(`${path}`, Object.assign({}, body, { params }))
      return response
    },
  
    Put: async (path: string, body = {}) => {
      const response = await instance.put(`${path}`, body)
      return response
    },

    Delete: async (path: string, body = {}) => {
      const response = await instance.delete(`${path}`, body)
      return response
    },

    Upload: async (path: string, data, config) => {
      const response = await instance.post(`${path}`, data, Object.assign({}, {
        header: { 'content-type': 'multipart/form-data' }
      }, config))
      return response
    }
  }
}

export default {
  user: sessionBuilder(
    'https://user-dev.dacsee.io/api/'
  ),

  circle: sessionBuilder(
    'https://circle-dev.dacsee.io/api/'
  ),

  booking: sessionBuilder(
    'https://booking-dev.dacsee.io/api/'
  ),

  location: sessionBuilder(
    'https://location-dev.dacsee.io/api/'
  ),

  driver: sessionBuilder(
    'https://driver-verification-dev.dacsee.io/api/'
  ),

  push: sessionBuilder(
    'https://push-dev.dacsee.io/api/'
  ),

  lookup: sessionBuilder(
    'https://lookup-dev.dacsee.io/api/'
  ),

  wallet: sessionBuilder(
    'https://wallet-dev.dacsee.io/api/'
  ),



  // V2

  User: sessionBuilder2(
    'https://user-dev.dacsee.io/api/'
  ),

  Circle: sessionBuilder2(
    'https://circle-dev.dacsee.io/api/'
  ),

  Booking: sessionBuilder2(
    'https://booking-dev.dacsee.io/api/'
  ),

  Location: sessionBuilder2(
    'https://location-dev.dacsee.io/api/'
  ),

  Driver: sessionBuilder2(
    'https://driver-verification-dev.dacsee.io/api/'
  ),

  Push: sessionBuilder2(
    'https://push-dev.dacsee.io/api/'
  ),

  Lookup: sessionBuilder2(
    'https://lookup-dev.dacsee.io/api/'
  ),

  Wallet: sessionBuilder2(
    'https://wallet-dev.dacsee.io/api/'
  )
}

