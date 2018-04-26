/* global navigator */
import moment from 'moment'

import {fork, all, take, call, put, takeEvery, takeLatest, race, select, cancel} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {application, account, booking, intl} from '../actions'
import {Session} from '../../utils'

const GetPosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), {timeout: 5000}))
const ForkService = {
  LocationService: null
}

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
    const {code, language} = yield call(Session.Lookup.Get, 'v1/lookup/country')
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

function* AutoLocationService() {
  while (true) {
    try {
      const {coords} = yield call(GetPosition)
      const {latitude, longitude} = coords
      yield all([
        put(application.setValues({gps_access: true})),
        put(account.updateLocation({latitude, longitude, lat: latitude, lng: longitude}))
      ])
    } catch (e) {
      try {
        navigator.geolocation.requestAuthorization()
      } catch (e) {/* */
      }
      if (e.code === 1 || e.code === 2) yield put(application.setValues({gps_access: false}))
    }
    yield delay(2500)
  }
}

function* initializationFlow(action) {
  const {local_language, account_status} = yield select(state => ({
    local_language: state.account.language,
    account_status: state.account.status
  }))
  yield put(intl.update(local_language))

  // 启动GPS监听服务
  ForkService.LocationService = yield fork(AutoLocationService)

  // 已登录状态
  if (account_status) {
    // 获取国家及地图信息
    while (true) {
      const value = yield call(GetCountry)
      if (!value) {
        yield delay(2000)
      } else {
        yield all([
          put(application.setValues({map_mode: value.map_mode})),
          put(account.setAccountValue({country: value.country, language: value.language})),
          put(intl.update(value.language))
        ])
        break
      }
    }

    // 获取车型数据
    while (true) {
      const value = yield call(GetVehicleGroupsAndCategories)
      if (!value) {
        yield delay(2000)
      } else {
        yield put(booking.passengerSetValue({
          vehicleGroups: value.vehicleGroups,
          vehicleCategories: value.vehicleCategories
        }))
        break
      }
    }
  }

  // 未登录
  if (!account_status) {
    if (ForkService.LocationService) {
      yield cancel(ForkService.LocationService)
    }
    // TODO:
  }

  yield put(application.setValues({main_run: true}))
}

export default function* initializationSaga() {
  yield takeLatest(action => {
    const {type} = action
    return (
      (type === 'persist/REHYDRATE') ||
      // (type === application.changeApplicationStatus().type) ||
      // (type === application.updatePushToken().type) ||
      (type === account.saveLogin().type) ||
      (type === application.updateLocationStatus().type)
    )
  }, initializationFlow)
}