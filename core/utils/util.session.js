/* global store */
import axios from 'axios'
import { account } from '../redux/actions'

const SESSION_TIMEOUT = 10000

const instance = axios.create({ timeout: SESSION_TIMEOUT })
// REQUEST HANDLE
instance.interceptors.request.use((config) => {
  const { method, url, headers } = config
  const reducer = store.getState()
  const { agent_enable, agent_server } = reducer.storage
  const { authToken } = reducer.account

  if (agent_enable && !headers['Agent-Disabled']) {
    // 自动代理模式
    config.headers['Origin-Url'] = url
    config.url = `${agent_server}api/v1/agent`
  }
  
  if (authToken) {
    config.headers.Authorization = authToken
  }

  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use((response) => {
  const { config } = response
  const { url, method } = config

  console.log(`[SESSION][${method.toUpperCase()}][${url}]`)
  const _response = response || { data: null }
  return _response.data || {}
}, (err) => {
  if (err.config) {
    const { url, method } = err.config
    const { data, status } = err.response
    console.warn(`[SESSION][${method.toUpperCase()}][${url}][${status}][${data.code}]`, err.response)

    if (status === 400 && data.code === 'INVALID_AUTHORIZATION_TOKEN') {
      store.dispatch(account.asyncLogout())
    }
  } else {
    console.warn(err) 
  }
  return Promise.reject(err)
})

const sessionMethodBuild = (baseUrl, agent) => {
  const config = { headers: { 'Agent-Disabled': agent } }

  return {
    Post: async (path: string, body = {}) => {
      return await instance.post(`${baseUrl}${path}`, body, config)
    },
  
    Get: async (path: string, body = {}, params = {}) => {
      return await instance.get(`${baseUrl}${path}`, Object.assign({}, body, { params }), config)
    },
  
    Put: async (path: string, body = {}) => {
      return await instance.put(`${baseUrl}${path}`, body, config)
    },

    Delete: async (path: string, body = {}) => {
      return await instance.delete(`${baseUrl}${path}`, body, config)
    },

    Upload: async (path: string, body = {}) => {
      return await instance.post(`${baseUrl}${path}`, body, { timeout: 120000 }, config)
    }
  }
}

export default {

  User: sessionMethodBuild(
    'https://user-dev.dacsee.io/api/'
  ),

  Circle: sessionMethodBuild(
    'https://circle-dev.dacsee.io/api/'
  ),

  Booking: sessionMethodBuild(
    'https://booking-dev.dacsee.io/api/'
  ),

  Location: sessionMethodBuild(
    'https://location-dev.dacsee.io/api/'
  ),

  Driver: sessionMethodBuild(
    'https://driver-verification-dev.dacsee.io/api/'
  ),

  Push: sessionMethodBuild(
    'https://push-dev.dacsee.io/api/'
  ),

  Lookup: sessionMethodBuild(
    'https://lookup-dev.dacsee.io/api/'
  ),

  Lookup_CN: sessionMethodBuild(
    // 'http://lookup-cn-dev.dacsee.cn'
    'http://47.98.40.59/api/',
    true
  ),

  Wallet: sessionMethodBuild(
    'https://wallet-dev.dacsee.io/api/'
  )
}

