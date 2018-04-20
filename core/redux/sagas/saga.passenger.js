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


function* bookingFlow() {

  while(true) {
    const action = yield take(booking.passengerSetStatus().type)
    const status = action.payload
    const { i18n, booking_id, destination, from, time, payment, type, selected_friends, fare, currentStatus } = yield select(state => ({
      ...state.booking,
      currentStatus: state.booking.status,
      booking_id: state.storage.booking_id,
      i18n: state.intl.messages || {}
    }))

    if (
      status === STATUS.PASSGENER_BOOKING_INIT ||
      status === STATUS.PASSGENER_BOOKING_HAVE_COMPLETE
    ) {
      yield all([
        put(booking.passengerSetID('')),
        put(booking.passengerSetValue({ destination: {}, time: 'now', payment: 'Cash' }))
      ])
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      yield all([
        put(booking.passengerSetID('')),
        put(booking.passengerSetValue({ driver_id: '', driver: {}, driver_info: {} }))
      ])
      if (!destination.coords || !from.coords) continue
    } else if (status === STATUS.PASSGENER_BOOKING_PICKED_OPTIONS) {
      //
    } else if (status === STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE) {
      if (
        (Array.isArray(selected_friends) && selected_friends.length === 0) ||
        (!Array.isArray(selected_friends) && selected_friends !== 'all')
      ) {
        yield put(application.showMessage(i18n.select_least_one))
        yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        continue
      }

      const body = {
        from,
        destination,
        fare: fare,
        type: 'now',
        notes : '',
        booking_at: Methods.timeZone(time),
        payment_method: Methods.payment(payment),
      }

      const vehicleGroups = yield select(state => state.booking.vehicleGroups)
      if (type === 'circle') {
        const vehicleGroupsId = vehicleGroups.find(pipe => pipe.name === 'My Circle' || pipe.name === '朋友圈')._id
        body.vehicle_category_id = vehicleGroupsId
        body.assign_type = typeof(selected_friends) === 'string' ? 'circle' : 'selected_circle'
      } else if (type === 'taxi') {
        const vehicleGroupsId = vehicleGroups.find(pipe => pipe.name === 'Taxi' || pipe.name === '出租车')._id
        body.vehicle_category_id = vehicleGroupsId
        body.assign_type = 'any'
      } else {
        const vehicleGroupsId = vehicleGroups.find(pipe => pipe.name === 'Private Car' || pipe.name === '专车')._id
        body.vehicle_category_id = vehicleGroupsId
        body.assign_type = 'any'
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
          yield put(booking.passengerSetID(doc._id))
          yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT))
        } else {
          yield put(application.showMessage(i18n.order_creat_err))
          yield put(booking.passengerSaveStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        }
        continue
      } catch (e) {
        const { response = {} } = e
        const { data = {} } = response
        const { code = '', message = '' } = data
        if (code === 'BOOKING_HAS_ACTIVE') {
          yield put(application.showMessage(i18n.hava_unfinish_order))
        } else if (code === 'NO_AVAILABLE_DRIVER') {
          yield put(application.showMessage(i18n.no_driver_order))
        } else {
          // yield put(application.showMessage(`${code}${message}`))
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
    } else if (
      // 当有未完成的订单时，检查订单状态并恢复订单
      booking_id.length > 0 &&
      (
        currentStatus === STATUS.PASSGENER_BOOKING_INIT ||
        currentStatus === STATUS.PASSGENER_BOOKING_PICKED_ADDRESS ||
        currentStatus === STATUS.PASSGENER_BOOKING_PICKED_OPTIONS
      ) && (
        status === STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY ||
        status === STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED ||
        status === STATUS.PASSGENER_BOOKING_ON_BOARD ||
        status === STATUS.PASSGENER_BOOKING_ON_RATING
      )
    ) {
      // TODO: 恢复车型数据
      console.log('[恢复数据]')
      const bookingDetail = yield call(Session.Booking.Get, `v1/bookings/${booking_id}?fields=payment_method,from,destination,fare`)
      console.log(bookingDetail)
      yield put(booking.passengerSetValue({
        destination: bookingDetail.destination,
        fare: bookingDetail.fare,
        from: bookingDetail.from,
        payment: bookingDetail.payment_method
      }))
    }

    // TODO COMPLETE
    // else if (status === STATUS.PASSGENER_BOOKING_HAVE_COMPLETE) {

    // }

    yield put(booking.passengerSaveStatus(status))
  }
}

function* bookingBoardCastListener() {
  while(true) {
    const i18n = yield select(state => state.intl.messages||{})
    const { payload: { action, booking_id } } = yield take(booking.passengerBoardCastListener().type)
    const status = yield select(state => state.booking.status)

    /* PASSENGER */
    if (action === 'CANCELLED_BY_DRIVER') { // 司机取消
      if (status >= STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
        yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
        yield put(application.showMessage(i18n.drive_cancel_order))
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
        yield put(application.showMessage(i18n.order_timeout))
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

function* passengerUpdateDriverLocation() {
  while(true) {
    const { driver_id, app_status, passengerStatus } = yield select(state => ({
      driver_id: state.booking.driver_id,
      passengerStatus: state.booking.status,
      app_status: state.application.application_status === 'active'
    }))

    if (!driver_id || !app_status || !(passengerStatus < STATUS.PASSGENER_BOOKING_HAVE_COMPLETE)) {
      yield delay(2000)
      continue
    } else {
      try {
        const driver = yield call(Session.Location.Get, `v1?reqUser_id=${driver_id}&userRole=passenger`)
        if ('latitude' in driver && 'longitude' in driver) {
          yield put(booking.passengerSetValue({ driver }))
        }
      } 
      catch (e) {/**/}
      finally {
        yield delay(5000)
      }
    }
  }
}

function* passengerStatusObserver() {

  while (true) {
    const { booking_id, app_status, i18n } = yield select(state => ({
      booking_id: state.storage.booking_id,
      app_status: state.application.application_status === 'active',
      i18n: state.intl.messages || {}
    }))

    if (!booking_id || !app_status) {
      yield delay(2500)
      continue
    } else {
      try {
        const passengerStatus = yield select(state => state.booking.status)
        const bookingDetail = yield call(Session.Booking.Get, `v1/bookings/${booking_id}?fields=driver_id,status,driver_info`)
        const driver_id = bookingDetail.driver_id
        const bookingStatus = bookingDetail.status
        const driver_info = bookingDetail.driver_info

        if (bookingStatus === 'No_Taker') {
          yield put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
          yield put(application.showMessage(i18n.order_timeout))
        } else if (bookingStatus === 'Cancelled_by_Driver') {
          const backStatus = passengerStatus === STATUS.PASSGENER_BOOKING_INIT ? STATUS.PASSGENER_BOOKING_INIT : STATUS.PASSGENER_BOOKING_PICKED_ADDRESS
          yield put(booking.passengerSetStatus(backStatus))
          yield put(application.showMessage(i18n.order_to_afresh))
        } else if (
          bookingStatus === 'On_The_Way' &&
          passengerStatus < STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY
        ) {
          yield all([
            put(booking.passengerSetValue({ driver_id, driver_info })),
            put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY))
          ])
        } else if (bookingStatus === 'Arrived') {
          yield all([
            put(booking.passengerSetValue({ driver_id, driver_info })),
            put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED))
          ])
        } else if (bookingStatus === 'On_Board') {
          yield all([
            put(booking.passengerSetValue({ driver_id, driver_info })),
            put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_ON_BOARD))
          ])
        } else if (bookingStatus === 'Completed') {
          yield all([
            put(booking.passengerSetValue({ driver_id: '', driver_info: {} })),
            put(booking.passengerSetStatus(STATUS.PASSGENER_BOOKING_INIT))
          ])
        }

        // console.log({
        //   driver_id,
        //   bookingStatus,
        //   passengerStatus
        // })
      } catch (e) {
        console.log(e)
      }
      yield delay(2500)
    }
  }
}

export default function* bookingHandle() {
  yield all([
    fork(passengerUpdateDriverLocation),
    fork(passengerStatusObserver),
    fork(bookingFlow),
    fork(bookingBoardCastListener),
    fork(bookingTriggerEventListener)
  ])
}
