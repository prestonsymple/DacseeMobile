/* global navigator */
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, account, booking } from '../actions'
import { Session } from '../../utils'

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 3000 }))

function* initializationFlow(action) {
  const { status, foreground } = yield select(state => ({ 
    status: state.account.status, 
    foreground: state.application.application_status === 'active'
  }))

  try {
    // 请求位置
    const { coords } = yield call(oncePosition)
    const { latitude, longitude } = coords 
    yield all([
      put(application.setValues({ gps_access: true })),
      put(account.updateLocation({ latitude, longitude, lat: latitude, lng: longitude }))
    ])

    // 配置当前所在国家和语言
    const { code, language } = yield call(Session.Lookup.Get, 'v1/lookup/country')
    // TODO: GET DEFAULT LANGUAGE SET
    const map_mode = code === 'CN' ? 'AMAP' : 'GOOGLEMAP'
    yield all([
      put(application.setValues({ map_mode })),
      put(account.setAccountValue({ country: code, language }))
    ])
  } catch (e) {
    try {
      navigator.geolocation.requestAuthorization()
    } catch (e) { /* DO NOTHING */ }
    if (e.code === 1 || e.code === 2) yield put(application.setValues({ gps_access: false }))
    // TODO: 增加默认位置坐标
  }

  if (!status || !foreground) return;

  try {
    const country = yield select(state => state.account.country)
    const vehicleGroups = yield call(Session.Lookup.Get, `v1/lookup/vehicleGroups?country=${country || 'MY'}`)
    yield put(booking.passengerSetValue({ vehicleGroups }))
  } catch (e) {
    console.log(e)
  }
}

export default function* initializationSaga() {
  yield takeLatest(action => {
    const { type } = action
    return (
      (type === 'persist/REHYDRATE') || 
      (type === application.changeApplicationStatus().type) ||
      (type === application.updatePushToken().type) || 
      (type === account.saveLogin().type)
    )
  }, initializationFlow)
}