/* global fetch */

import { Keyboard } from 'react-native'
import moment from 'moment'
import axios from 'axios'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application } from '../actions'

function* ping(server, agent = false) {
  const start = new Date()
  let response = undefined
  try {
    const _server = agent ? `${server}/api/v1/agent/map` : server
    response = yield call(axios.get, _server, { timeout: 3000 })
  } catch (e) { /* DO NOTHING */ }
  const div = (new Date()).getTime() - start.getTime()
  if (agent && response && response.data) {
    return { average: response.data.average, server }
  }
  return div
}

function* networkObserver() {
  while (true) {
    yield take(application.changeNetworkStatus().type)
    const apiMaps = yield select(state => state.application.api_maps)
    
    // 获取主服务器响应时间
    const mainApi = apiMaps.main.map(pipe => call(ping, pipe))
    const mainTimeArgs = yield all(mainApi)
    const localTime = parseInt(mainTimeArgs.reduce((prev, next) => prev + next) / mainTimeArgs.length)

    // 获取代理服务器响应时间
    const agentApi = apiMaps.agent.map(pipe => call(ping, pipe, true))
    const agentTime = yield all(agentApi)
    const minAgent = agentTime.sort((a, b) => a.average < b.average)[0]
    
    const enableAgent = localTime > minAgent.average ? true : false
    if (enableAgent) {
      yield put(application.setAgentSvr(minAgent.server))
    } else {
      yield put(application.setAgentSvr(''))
    }

    yield delay(10000)
  }
}

export default function* networkSaga() {
  yield all([
    fork(networkObserver)
  ])
}