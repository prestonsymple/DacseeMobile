/* global navigator */

import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, booking, account, intl } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'
import { BOOKING_STATUS as STATUS } from '../../route/main'
import { getDeviceCountry } from 'react-native-device-info';

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 2500 }))

function* GetVehicleGroupsAndCategories() {
  try {
    const country = yield select(state => state.account.country)
    const vehicleGroups = yield call(Session.Lookup.Get, `v1/lookup/vehicleGroups?country=${country || 'MY'}`)
    const groupId = vehicleGroups.find(pipe => pipe.name === 'My Circle' || pipe.name === '朋友圈')._id
    const vehicleCategories = yield call(Session.Lookup.Get, `v1/lookup/vehicleCategories?group_id=${groupId}`)
    return {
      vehicleGroups,
      vehicleCategories
    }
  } catch (e) {
    return false
  }
}

function* GetCountry() {
  try {
    const { code, language } = yield call(Session.Lookup.Get, 'v1/lookup/country')
    const map_mode = code === 'CN' ? 'AMAP' : 'GOOGLEMAP'
    return {
      map_mode,
      country: code,
      language
    }
  } catch (e) {
    // return false
    return {
      map_mode: 'GOOGLEMAP',
      country: 'MY',
      language: 'en-US'
    }
  }
}

function* InitProfile() {
  // 初始化配置
  try {
    while(true) {
      const value = yield call(GetCountry)
      try {
        navigator.geolocation.requestAuthorization()
      } catch (e) {/* */}
      if (!value) {
        yield delay(2500)
        continue
      } else {
        yield all([
          put(application.setValues({ map_mode: value.map_mode })),
          put(account.setAccountValue({ country: value.country, language: value.language })),
          put(intl.update(value.language))
        ])
        break
      }
    }

    while(true) {
      const value = yield call(GetVehicleGroupsAndCategories)
      if (!value) {
        yield delay(2500)
        continue
      } else {
        yield put(booking.passengerSetValue({ vehicleGroups: value.vehicleGroups, vehicleCategories: value.vehicleCategories }))
        break
      }
    }
  } catch (e) {
    /* */
  }
}

function* WatchLocationChange() {
  try {
    while(true) {
      const login = yield select(state => state.account.status)
      if (!login) {
        yield delay(1000)
        continue
      }
      
      // 设置位置信息
      const { coords } = yield call(oncePosition)
      const { latitude, longitude } = coords 
      yield all([
        put(application.setValues({ gps_access: true })),
        put(account.updateLocation({ latitude, longitude, lat: latitude, lng: longitude }))
      ])
  
      const map_mode = yield select(state => state.application.map_mode)
      /* 初始化地图相关 */
      if (map_mode === '') {
        yield call(InitProfile)
      }
  
      yield delay(1000) 
    }
  } catch (e) {
    try {
      navigator.geolocation.requestAuthorization()
    } catch (e) {/**/}
    if (e.code === 1 || e.code === 2) yield put(application.setValues({ gps_access: false }))
    yield delay(2500)
  }
}

export default function* () {
  yield takeLatest(action => (
    action.type === 'persist/REHYDRATE' ||
    action.type === application.updateLocationStatus().type
  ), function*() {
    yield fork(WatchLocationChange)
  })
}