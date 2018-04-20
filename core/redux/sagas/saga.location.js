import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, booking } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'
import { BOOKING_STATUS as STATUS } from '../../route/main'

function* LocationService() {
  while(true) {
    yield take('eventwssss') 
  }
}

export default function* () {
  yield all([
    fork(LocationService)
  ])
}