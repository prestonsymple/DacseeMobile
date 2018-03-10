import { Keyboard } from 'react-native'
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, booking } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

const Methods = {
  payment: (val) => {
    return 'Cash'
  },
  timeZone: (val) => {
    if (typeof(val) === 'string' && val === 'now') {
      return moment(new Date()).format()
    }
    return moment(val).format()
  }
}


function* trackLocation() {

}

function* bookingRun() {
  yield put(booking.journeyUserWaitDriverRespond())
  const payload = yield select(state => ({ ...state.booking }))

  console.log(payload)

  const body = {
    type: 'now',
    from : {
      address : payload.from.address, 
      coords : { lat : payload.from.location.lat,  lng : payload.from.location.lng }, 
      name : payload.from.name, 
      placeId : payload.from.uid
    },
    notes : '', 
    destination : {
      address : payload.to.address, 
      coords : { lat : payload.to.location.lat,  lng : payload.to.location.lng }, 
      name : payload.to.name, 
      placeId : payload.to.uid
    },
    // vehicle_type : 'Economy',
    booking_at: Methods.timeZone(payload.time),
    payment_method: Methods.payment(payload.payment),
    fare: 30
  }

  if (payload.type === 'circle') {
    body.assign_type = 'selected_circle'
    body.selected_circle_ids = payload.selected_friends.map(pipe => pipe.friend_id)
  }

  console.log(body)
  const response = yield call(Session.booking.post, 'v1', body)
  console.log(response)

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
    try {
      yield take(booking.journeyUserStart().type)

      const { complate, cancel } = yield race({
        complate: call(bookingRun),
        cancel: take(booking.journeyUserCancel().type)
      })

      if (complate) {
        yield put(booking.journeyUserComplate())
      }

      // if (cancel) {}
    } catch (e) {
      console.log(e)
    }
  }
}