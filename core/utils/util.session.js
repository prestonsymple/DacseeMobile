/* global store */
import axios from 'axios'
import { account } from '../redux/actions'

const FILTER_DOMAIN_MAPS = [
  'http://47.98.40.59/'
]

const FILTER_MESSAGE_MAPS = [
  'https://booking-dev.dacsee.io/api/v1/booking',
  'https://location-dev.dacsee.io/api/v1?reqUser'
]

const SESSION_TIMEOUT = 10000

const instance = axios.create({ timeout: SESSION_TIMEOUT })
// REQUEST HANDLE
instance.interceptors.request.use((config) => {
  const { method, url, headers } = config
  const reducer = store.getState()
  const { agent_enable, agent_server } = reducer.storage
  const { authToken, location } = reducer.account

  // 全局请求头
  config.headers['latitude'] = location.latitude
  config.headers['longitude'] = location.longitude

  // 自动代理模式
  if (
    agent_enable && 
    typeof(FILTER_DOMAIN_MAPS.find(pipe => url.startsWith(pipe))) === 'undefined'
  ) {
    config.headers['Origin-Url'] = encodeURI(url)
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
  const { url, method, headers } = config

  const _response = response || { data: null }

  // if (url.toLowerCase().endsWith('v1/agent')) {
  //   console.log(`[SESSION][${method.toUpperCase()}][${headers['Origin-Url']}][AGENT MODE]`, _response.data)
  // } else {
  //   console.log(`[SESSION][${method.toUpperCase()}][${url}]`, _response.data)
  // }
  return _response.data || {}
}, (err) => {
  if (err.config) {
    const { url = '', method = '' } = err.config
    const { data = {}, status = 0 } = err.response
    console.log(`[SESSION][${method.toUpperCase()}][${url}][${status}][${data.code}]`, err.response)

    // if (status === 400 && data.code === 'INVALID_AUTHORIZATION_TOKEN') {
    //   store.dispatch(account.asyncLogout())
    // }
  } else {
    console.log(err) 
  }
  return Promise.reject(err)
})

const sessionMethodBuild = (baseUrl) => {
  return {
    Post: async (path: string, body = {}) => {
      return await instance.post(`${baseUrl}${path}`, body)
    },
  
    Get: async (path: string, body = {}, params = {}) => {
      return await instance.get(`${baseUrl}${path}`, Object.assign({}, body, { params }))
    },
  
    Put: async (path: string, body = {}) => {
      return await instance.put(`${baseUrl}${path}`, body)
    },

    Delete: async (path: string, body = {}) => {
      return await instance.delete(`${baseUrl}${path}`, body)
    },

    Upload: async (path: string, body = {}) => {
      return await instance.post(`${baseUrl}${path}`, body, { timeout: 120000 })
    }
  }
}

export default {

  User: sessionMethodBuild(
    'https://svc-prod-user.dacsee.io/api/'
  ),

  Campaign: sessionMethodBuild(
    'https://svc-prod-campaign.dacsee.io/api/'
  ),

  Circle: sessionMethodBuild(
    'https://svc-prod-circle.dacsee.io/api/'
  ),

  Booking: sessionMethodBuild(
    'https://svc-prod-booking.dacsee.io/api/'
  ),

  Driver: sessionMethodBuild(
    'https://svc-prod-dv.dacsee.io/api/'
  ),

  Location: sessionMethodBuild(
    'https://svc-prod-location.dacsee.io/api/'
  ),

  Push: sessionMethodBuild(
    'https://svc-prod-push.dacsee.io/api/'
  ),

  Scheduler: sessionMethodBuild(
    'https://svc-prod-scheduler.dacsee.io/api/'
  ),

  Rating: sessionMethodBuild(
    'https://svc-prod-rating.dacsee.io/api/'
  ),


  Lookup: sessionMethodBuild(
    'https://svc-prod-lookup.dacsee.io/api/'
  ),

  Lookup_CN: sessionMethodBuild(
    // 'http://lookup-cn-dev.dacsee.cn'
    // https://svc-prod-lookup-cn.dacsee.io
    'http://47.98.40.59/api/'
  ),

  Wallet: sessionMethodBuild(
    'https://svc-prod-wallet.dacsee.io/api/'
  )
}

