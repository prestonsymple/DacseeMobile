import { Keyboard } from 'react-native'
import moment from 'moment'

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

var MAIN_TIMER_QUEUE = []


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

function* bookingDetailWatch() {
  
}

function* bookingFlow() {
  while(true) {
    const action = yield take(booking.passengerSetStatus().type)
    const status = action.payload
    const { booking_id, destination, from, time, payment, type, selected_friends, fare } = yield select(state => ({
      ...state.booking
    }))


    if (status === STATUS.PASSGENER_BOOKING_INIT) {
      yield put(booking.passengerSetValue({ destination: {}, time: 'now', payment: '现金支付' }))
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      if (!destination.location || !from.location) continue
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_OPTIONS) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE) {
      if (
        (Array.isArray(selected_friends) && selected_friends.length === 0) ||
        (!Array.isArray(selected_friends) && selected_friends !== 'all')
      ) {
        yield put(application.showMessage('请选择至少一个朋友'))
        yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        continue
      }

      const body = {
        type: 'now',
        from : {
          address : from.address, 
          coords : { lat : from.location.lat,  lng : from.location.lng }, 
          name : from.name, 
          placeId : from.uid
        },
        notes : '', 
        destination : {
          address : destination.address, 
          coords : { lat : destination.location.lat,  lng : destination.location.lng }, 
          name : destination.name, 
          placeId : destination.uid
        },
        fare: fare,
        booking_at: Methods.timeZone(time),
        payment_method: Methods.payment(payment),
      }

      if (type === 'circle') {
        body.assign_type = typeof(selected_friends) === 'string' ? 'circle' : 'selected_circle'
      }

      if (type === 'circle' && Array.isArray(selected_friends)) {
        body.selected_circle_ids = selected_friends.map(pipe => pipe.friend_id)
      }

      // 请求价格 && 创建订单
      try {
        yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE))
        // const {  } = yield call(
          
        // )
        // body.fare = fare.Circle

        const { doc, isSuccess } = yield call(Session.Booking.Post, 'v1', body) 
        if (isSuccess) {
          yield put(booking.passengerSetValue({ booking_id: doc._id }))
          yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT))
        } else {
          yield put(application.showMessage('订单创建失败'))
          yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        }
        continue
      } catch (e) {
        const { response = {} } = e
        const { data = {} } = response
        const { code = '', message = '' } = data
        if (code === 'BOOKING_HAS_ACTIVE') {
          yield put(application.showMessage('当前还有未结束的行程'))
        } else if (code === 'NO_AVAILABLE_DRIVER') {
          yield put(application.showMessage('当前没有可接单的司机'))
        } else {
          yield put(application.showMessage('无法连接到服务器，请检查网络'))
        }
        yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        continue
      }
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT) {
      // MAIN_TIMER_QUEUE[0] && clearTimeout(MAIN_TIMER_QUEUE[0])
      // MAIN_TIMER_QUEUE[0] = setTimeout(function () {
      //   yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT))
      // }, 2000)
      continue
    } else if (status === STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY) {
      // MAIN_TIMER_QUEUE[0] && clearTimeout(MAIN_TIMER_QUEUE[0])
      yield put(NavigationActions.navigate({ routeName: 'BookingDriverDetail', params: { booking_id } }))
    } else if (status === STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_ON_BOARD) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_ON_RATING) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_HAVE_COMPLETE) {
      //
    }

    yield put(booking.passengerSaveStatus(status))
  }
}

function* bookingBoardCastListener() {
  while(true) {
    const { payload: { action, booking_id } } = yield take(booking.passengerBoardCastListener().type)
    const status = yield select(state => state.booking.status)

    /* PASSENGER */
    if (action === 'CANCELLED_BY_DRIVER') { // 司机取消
      if (status >= STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        ///
      }
    } else if (action === 'ON_THE_WAY') { // 司机接单-已在路上
      if (status < STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY))
      }
    } else if (action === 'ARRIVED') { // 司机已到达指定位置
      if (status < STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED))
      }
    } else if (action === 'NO_SHOW') { // 未找到乘客
      if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
      }
    } else if (action === 'ON_BOARD') { // 行驶中
      if (status < STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_ON_BOARD))
      }
    } else if (action === 'NO_TAKER') { // 没有司机
      if (status === STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        yield put(application.showMessage('暂无司机接单，订单超时，已被取消'))
      }
    } else if (action === 'COMPLETED') { // 完成订单
      if (status === STATUS.PASSGENER_BOOKING_ON_RATING) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_ON_RATING))
      }
    } else if (action === 'CANCELLED_BY_PASSENGER') { // 乘客取消订单
    }
  }
}

function* bookingTriggerEventListener() {
  while(true) {
    const action = yield take(booking.passengerTriggerEventListener().type)
    const event = action.payload

  }
}

export default function* bookingHandle() {
  try {
    yield all([
      fork(bookingFlow),
      fork(bookingBoardCastListener),
      fork(bookingTriggerEventListener)
    ])
  } catch(e) {
    console.log(e)
  }
}