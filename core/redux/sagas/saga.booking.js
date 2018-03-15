import { Keyboard } from 'react-native'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, booking } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'
import { BOOKING_STATUS as STATUS } from '../../route/main'

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

    const { from, to } = payload

    const fares = yield call(
      Session.Booking.Get, 
      `v1/fares?from_lat=${from.location.lat}&from_lng=${from.location.lng}&destination_lat=${to.location.lat}&destination_lng=${to.location.lng}`
    )

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
      fare: fares.fare.Circle // 仅限朋友圈
    }

    if (payload.type === 'circle') {
      body.assign_type = 'selected_circle'
      body.selected_circle_ids = payload.selected_friends.map(pipe => pipe.friend_id)
    }

    try {
      const { doc, isSuccess } = yield call(Session.Booking.Post, 'v1', body) 
      if (!isSuccess) {
        yield put(booking.journeyUserCancel())
      } else {
        yield put(booking.journeyUpdateData({ booking_id: doc._id }))
      }
    } catch (e) {
      yield put(booking.journeyUserCancel())
      yield put(application.showMessage('无法连接到服务器，请检查您的网络'))
    }
  }
}

function* bookingOnTheWay() {
  while(true) {
    const { payload } = yield take(booking.journeyUserDriverRespondSuccess().type)
    yield put(NavigationActions.navigate({ routeName: 'BookingDriverDetail', params: { booking_id: payload } }))
  }
}

function* bookingOnComplete() {
  while (true) {
    const { payload } = yield take(booking.passengerEventDriverComplete().type)
    yield put(NavigationActions.navigate({ routeName: 'BookingComplete', params: { booking_id: payload } }))
    // const { nav } = yield select(state => ({ nav: state.nav }))
    // console.log(nav)
  }
}

function* cancelBooking() {
  while (true) {
    yield take(booking.journeyUserDriverRespondFail().type)
    yield put(booking.journeyUserCancel())
  }
}

// function* bookingFlow() {
//   while(true) {
//     yield take(booking.passengerSetStatus)
//   }
// }

function* bookingFlow() {
  while(true) {
    const action = yield take(booking.passengerSetStatus().type)
    const status = action.payload
    const booking_id = yield select(state => state.storage.booking_id)
    
    if (status === STATUS.PASSGENER_BOOKING_INIT) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_OPTIONS) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_ON_THE_WAY) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_ON_RATING) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_HAVE_COMPLETE) {
      //
    }
  }
}

function* bookingBoardCastListener() {
  while(true) {
    const { action, booking_id } = yield take(booking.passengerBoardCastListener.type())
    const status = yield select(state => state.booking.status)

    /* PASSENGER */
    if (action === 'CANCELLED_BY_DRIVER') { // 司机取消
      if (status >= STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        // 
      }
    } else if (action === 'ON_THE_WAY') { // 司机接单-已在路上
      if (status < STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ON_THE_WAY) {
        //
      }
    } else if (action === 'ARRIVED') { // 已到达
      if (status < STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        //
      }
    } else if (action === 'NO_SHOW') { // 未找到乘客
      if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        //
      }
    } else if (action === 'ON_BOARD') { // 行驶中
      if (status < STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ON_THE_WAY) {
        //
      }
    } else if (action === 'NO_TAKER') { // 没有司机
      if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT) {
        //
      }
    } else if (action === 'COMPLETED') { // 完成订单
      if (status === STATUS.PASSGENER_BOOKING_ON_RATING) {
        //
      }
    }
  }
}

function* bookingTriggerEventListener() {
  while(true) {
    const action = yield take(booking.passengerTriggerEventListener.type())
    const event = action.payload

  }
}

export default function* bookingHandle() {
  try {
    yield all([
      fork(bookingFlow),
      // fork(bookingBoardCastListener),
      // fork(bookingTriggerEventListener)
    ])
  } catch(e) {
    console.log(e)
  }
}