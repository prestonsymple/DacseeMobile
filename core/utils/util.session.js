/* global store */
import axios from 'axios'
import Server from '../server.json'

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

  // }
  return _response.data || {}
}, (err) => {
  if (err.config) {
    const { url = '', method = '' } = err.config
    const { data = {}, status = 0 } = err.response
    console.log(`[SESSION][${method.toUpperCase()}][${url}][${status}][${data.code}]`, err.response)

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

  User: sessionMethodBuild(Server.User),

  Campaign: sessionMethodBuild(Server.Campaign),

  Circle: sessionMethodBuild(Server.Circle),

  Booking: sessionMethodBuild(Server.Booking),

  Driver: sessionMethodBuild(Server.Driver),

  Location: sessionMethodBuild(Server.Location),

  Push: sessionMethodBuild(Server.Push),

  Scheduler: sessionMethodBuild(Server.Scheduler),

  Rating: sessionMethodBuild(Server.Rating),


  Lookup: sessionMethodBuild(Server.Lookup),

  Lookup_CN: sessionMethodBuild(Server.Lookup_CN),

  Wallet: sessionMethodBuild(Server.Wallet)
}

