/* global navigator */

import { Keyboard } from 'react-native'
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { driver, application } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 3000 }))

function* watchBooking() {
  while(true) {
    try {
      const { payload } = yield take(driver.driverSetStatus().type)
      // const { data } = yield call(Session.booking.get, `v1/bookings/${payload}?fields=type,from,notes,destination,booking_at,payment_method,fare,passenger_info`)
      // yield put(driver.setJobs({ detail: data }))
      // yield put(driver.showJobsDetail())
    } catch (e) {
      console.log(e)
    }
  }
}

function* updateDriverLocation() {
  while(true) {
    try {
      const { working, map_mode } = yield select(state => ({
        working: state.driver.working,
        map_mode: state.application.map_mode
      }))
      if (working) {
        let location = { latitude: undefined, longitude: undefined }
        if (map_mode === 'AMAP') {
          location = yield select(state => state.account.location)
          delete location.lat
          delete location.lng
        } else if (map_mode === 'GOOGLEMAP') {
          const position = yield call(oncePosition)
          location = position.coords
          delete location.accuracy
          delete location.altitude
          delete location.altitudeAccuracy
          delete location.heading
          delete location.speed
        }
        yield call(Session.Location.Put, 'v1', Object.assign(location, {
          vehicle_id: '5a7843962dd97f23dc6a070c'
        }))
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

    const { booking_id, app_status, working, logined, user_id } = yield select(state => ({
      booking_id: state.storage.driver_booking_id,
      app_status: state.application.application_status === 'active',
      logined: state.account.status,
      working: state.driver.working,
      user_id: state.account.user._id
    }))


    const fields = [
      '_id', 'assign_type', 'booking_at', 'country', 'destination', 
      'fare', 'from', 'notes', 'status', 'payment_method', 'passenger_info'
    ]


    if (working) {
      // LISTEN NEW JOBS
      try {
        let jobs = yield call(Session.Booking.Get, `v1/bookings?role=driver&limit=10&sort=-booking_at&fields=${fields.join(',')}`)
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
    fork(updateDriverLocation),
    fork(watchBooking)
  ])
}