import { Keyboard } from 'react-native'
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { jobs } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

export default function* watchBooking() {
  while(true) {
    try {
      const { payload } = yield take(jobs.newJobs().type)
      const { data } = yield call(Session.booking.get, `v1/bookings/${payload}?fields=type,from,notes,destination,booking_at,payment_method,fare,passenger_info`)
      yield put(jobs.setJobs({ detail: data }))
      yield put(jobs.showJobsDetail())
    } catch (e) {
      console.log(e)
    }
  }
}