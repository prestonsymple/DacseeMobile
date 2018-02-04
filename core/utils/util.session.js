import axios from 'axios'

const SESSION_TIMEOUT = 2500

const sessionBuilder = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: SESSION_TIMEOUT,
    // headers: {'X-Custom-Header':'foobar'}
  })

  // DEBUG && API请求响应中间件 - 记录组件
  instance.interceptors.response.use((response) => {
    console.log('[DEBUG][SESSION][RESPONSE][+]', response, '[DEBUG][SESSION][RESPONSE][-]')
    return response
  }, (err) => {
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

  booking: sessionBuilder(
    'http://booking-dev.dacsee.io/api/'
  ),

  location: sessionBuilder(
    'http://location-dev.dacsee.io/api/'
  ),

  driver: sessionBuilder(
    'http://driver-verification-dev.dacsee.io/api/'
  )
}

