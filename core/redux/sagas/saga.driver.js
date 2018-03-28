import { Keyboard } from 'react-native'
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { driver } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

function* watchBooking() {
  while(true) {
    try {
      const { payload } = yield take(driver.newJobs().type)
      const { data } = yield call(Session.booking.get, `v1/bookings/${payload}?fields=type,from,notes,destination,booking_at,payment_method,fare,passenger_info`)
      yield put(driver.setJobs({ detail: data }))
      yield put(driver.showJobsDetail())
    } catch (e) {
      console.log(e)
    }
  }
}

function* driverStatusObserver() {
  // while (true) {
    // const { booking_id, app_status } = yield select(state => ({
    //   booking_id: state.storage.booking_id,
    //   app_status: state.application.application_status === 'active'
    // }))

    // if (!booking_id || !app_status) {
    //   yield delay(2500)
    //   continue
    // } else {
    //   try {
    //     const status = yield select(state => state.booking.status)
    //     const booking = yield call(Session.Booking.Get, '/v1') 
    //     console.log(booking)
    //   } catch (e) {
    //     console.log(e)
    //   }
    //   yield delay(2500)
    // }
  // }
}

export default function* driverSaga() {
  yield all([
    // fork(driverStatusObserver),
    fork(watchBooking)
  ])
}