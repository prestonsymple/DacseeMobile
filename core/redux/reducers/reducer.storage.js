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
  driver_booking_id: '',
  
  agent_enable: false,
  agent_server: ''
}

export default handleActions({
  [booking.passengerSetID]: (state, { payload }) => Object.assign({}, state, { booking_id: payload }),

  [driver.driverSetID]: (state, { payload }) => Object.assign({}, state, { driver_booking_id: payload }),

  [application.setPushServiceToken]: (state, { payload }) => Object.assign({}, state, payload),

  [application.setAgentSvr]: (state, { payload }) => Object.assign({}, state, { agent_server: payload, agent_enable: payload.length !== 0 }),
}, initialState)
