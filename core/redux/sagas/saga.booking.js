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

function* newBooking() {
  while (true) {
    yield take(booking.journeyUserStart().type)
    yield put(booking.journeyUserWaitDriverRespond())
    const payload = yield select(state => ({ ...state.booking }))

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

    try {
      const response = yield call(Session.booking.post, 'v1', body) 
    } catch (e) {
      yield put(booking.journeyUserCancel())
    }
  }
}

function* cancelBooking() {
  while (true) {
    yield take(booking.journeyUserDriverRespondFail().type)
    yield put(booking.journeyUserCancel())
  }
}

export default function* watch() {
  yield all([
    fork(newBooking),
    fork(cancelBooking)
  ])
}