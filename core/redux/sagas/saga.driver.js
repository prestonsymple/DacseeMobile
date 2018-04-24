/* global navigator */

import { Keyboard } from 'react-native'
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { driver, application } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'
import LocationService from '../../native/location-service'

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 3000 }))

function* updateDriverLocation() {
  while(true) {
    try {
      const { working, map_mode, authToken } = yield select(state => ({
        working: state.driver.working,
        map_mode: state.application.map_mode,
        authToken: state.account.authToken
      }))

      const vehicle_id = '5a7843962dd97f23dc6a070c'
      if (working && System.Platform.Android) {
        yield call(LocationService.startTracking, authToken, vehicle_id)
      } else if (working && System.Platform.iOS) {
        const location = yield select(state => state.account.location)
        yield call(Session.Location.Put, 'v1', Object.assign({}, location, { vehicle_id }))
      } else if (!working && System.Platform.Android) {
        yield call(LocationService.stopTracking)
      }
    } catch (e) {
      console.log(e)
      // DO NOTHING
    }
    yield delay(5000)
  }
}

function* driverStatusObserver() {
  while (true) {

    const { map_mode, working, logined, user_id } = yield select(state => ({
      // booking_id: state.storage.driver_booking_id,
      // app_status: state.application.application_status === 'active',
      map_mode: state.application.map_mode,
      logined: state.account.status,
      working: state.driver.working,
      user_id: state.account.user._id
    }))

    if (map_mode.length === 0) {
      yield delay(2500)
      continue
    }


    const fields = [
      '_id', 'assign_type', 'booking_at', 'country', 'destination', 
      'fare', 'from', 'notes', 'status', 'payment_method', 'passenger_info'
    ]


    if (working) {
      // LISTEN NEW JOBS
      try {
        let jobs = yield call(Session.Booking.Get, `v1/bookings?role=driver&limit=15&sort=-booking_at&fields=${fields.join(',')}`)
        jobs = jobs.filter(({ status }) => {
          if (
            status === 'Cancelled_by_Passenger' ||
            status === 'Cancelled_by_Driver' ||
            status === 'Completed'
          ) return false
          return true
        })
        yield put(driver.driverSetValue({ jobs }))
      } catch (e) {
        // DO NOTHING
      } 
    } else if (!working && logined) {
      try {
        let activeBooking = yield call(Session.Booking.Get, 'v1/activeBookings')
        activeBooking = activeBooking.filter(pipe => pipe.passenger_id !== user_id)
        // 恢复工作模式
        if (activeBooking.length > 0) {
          const jobs = yield all(activeBooking.map(pipe => call(Session.Booking.Get, `v1/bookings/${pipe._id}?fields=${fields.join(',')}`)))
          yield all([
            put(application.setCoreMode('driver')),
            put(driver.driverSetValue({ working: true, jobs }))
          ])
          yield put(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: jobs[0] } }))
        }
      } catch (error) { /* */ }
    }

    yield delay(2500)
  }
}

export default function* () {
  yield all([
    fork(driverStatusObserver),
    fork(updateDriverLocation)
  ])
}