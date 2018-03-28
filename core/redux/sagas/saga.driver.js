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
  try {
    const { location } = yield select(state => ({ location: state.account.location }))
    yield call(Session.Location.Put, 'v1', location)
  } catch (e) {
    // DO NOTHING
  }
}

function* updateDriverJobs() {
  try {
    let jobs = yield call(Session.Booking.Get, 'v1/bookings?role=driver&limit=20&order=desc')
    jobs = jobs.filter(({ status }) => {
      if (
        status === 'Cancelled_by_Passenger' ||
        status === 'asdsad'
      ) return false
      return true
    })
    yield put(driver.driverSetValue({ jobs }))
  } catch (e) {
    // DO NOTHING
  }
}

function* driverStatusObserver() {
  while (true) {
    const { booking_id, app_status, working } = yield select(state => ({
      booking_id: state.storage.driver_booking_id,
      app_status: state.application.application_status === 'active',
      working: state.driver.working
    }))

    // WAIT WORK STATUS
    if (!working) {
      yield delay(2500)
      continue
    }

    yield all([
      // UPDATE DRIVER LOCATION
      fork(updateDriverLocation),
      // LISTEN NEW JOBS
      fork(updateDriverJobs)
    ])

    yield delay(2500)
  }
}

export default function* driverSaga() {
  yield all([
    fork(driverStatusObserver),
    fork(watchBooking)
  ])
}