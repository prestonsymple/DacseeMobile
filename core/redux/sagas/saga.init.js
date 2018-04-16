/* global navigator */
import moment from 'moment'
import Permissions from 'react-native-permissions'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, account, booking, intl } from '../actions'
import { Session } from '../../utils'

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 2500 }))
const permissionsCheck = (permission) => Permissions.check(permission)
const permissionsReqeust = (permission) => Permissions.request(permission)


function* initializationFlow(action) {
  const { status, foreground, save_language } = yield select(state => ({ 
    status: state.account.status, 
    save_language: state.account.language,
    foreground: state.application.application_status === 'active'
  }))

  // 多语言状态恢复
  if (action.type === 'persist/REHYDRATE') {
    yield put(intl.update(save_language))
  }

  // 默认语言及地区配置
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
    const map_mode = code === 'CN' ? 'GOOGLEMAP' : 'GOOGLEMAP'
    if (save_language) {
      yield all([
        put(application.setValues({ map_mode })),
        put(account.setAccountValue({ country: code })),
      ])
    } else {
      yield all([
        put(application.setValues({ map_mode })),
        put(account.setAccountValue({ country: code, language })),
        put(intl.update(language))
      ])
    }
  } catch (e) {
    try {
      navigator.geolocation.requestAuthorization()
      const permissionStatus = yield call(permissionsCheck, 'location')
      if (permissionStatus !== 'authorized') {
        yield call(permissionsReqeust, 'location')
      }
    } catch (e) { /* */ }

    if (e.code === 1 || e.code === 2) yield put(application.setValues({ gps_access: false }))
    // 辅助定位模式 //TODO : 辅助定位
    if (e.code === 3) yield all([
      put(application.setValues({ map_mode: 'AMAP' })),
      put(account.setAccountValue({ country: 'MY', language: 'cn' }))
    ])
  }

  if (!status || !foreground) return

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
      (type === account.saveLogin().type) ||
      (type === application.updateLocationStatus().type)
    )
  }, initializationFlow)
}