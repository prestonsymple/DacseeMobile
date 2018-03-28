'use strict'

import {
  application,
  booking,
  driver
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  push_service_token: '',
  baidu_user_id: '',

  booking_id: '',
  driver_booking_id: ''
}

export default handleActions({
  [booking.passengerSetID]: (state, { payload }) => Object.assign({}, state, { booking_id: payload }),

  [driver.driverSetID]: (state, { payload }) => Object.assign({}, state, { driver_booking_id: payload }),

  [application.setPushServiceToken]: (state, { payload }) => Object.assign({}, state, payload)
}, initialState)
