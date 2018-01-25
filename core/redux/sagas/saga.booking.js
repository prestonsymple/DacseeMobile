import { Keyboard } from 'react-native'

import { fork, all, take, call, put, takeEvery, takeLatest, race } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, booking } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'


function* trackLocation() {

}

function* bookingRun(payload) {
  
  yield put(booking.journeyUserWaitDriverRespond())
  yield delay(6000) // TODO: LOOP REQUEST API

  // TODO: Fix Driver Logic
  if (false) {
    yield put(booking.journeyUserDriverRespondFail())
    yield delay(5000)
    yield put(booking.journeyUserCancel())
  }

  yield put(booking.journeyUserDriverRespondSuccess())
  yield take(booking.journeyUserAboardCar().type)

  // TODO: 逻辑不确定 - 定期上传位置还是实时上传

  yield take(booking.journeyDriverHaveReached().type)
  // yield put(booking.journeyWaitingPayment())
  // yield put(booking.journeyWaitingFeedback())
}

export default function* watchBooking() {
  while(true) {
    const payload = yield take(booking.journeyUserStart().type)
    yield delay(500)

    const { complate, cancel } = yield race({
      complate: call(bookingRun, payload),
      cancel: take(booking.journeyUserCancel().type)
    })

    if (complate) {
      yield put(booking.journeyUserComplate())
    }

    if (cancel) {

    }
  }
}