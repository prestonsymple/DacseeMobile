'use strict'

import {
  booking
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  schedule: 0,
  to: {},
  from: {},
  type: 'standard',
  name: '优选',
  payment: '现金支付',
  book: false,
  time: 'now',
  selected_friends: [],
  booking_id: '',
  status: ''
}

export default handleActions({
  [booking.journeyUserCancel]: (state, { payload }) => Object.assign({}, state, { schedule: 0, booking_id: '' }),
  [booking.journeyUserComplate]: (state, { payload }) => Object.assign({}, state, { schedule: 0 }),

  [booking.journeyUserStart]: (state) => Object.assign({}, state, { schedule: 1 }),

  [booking.journeyUserWaitDriverRespond]: (state) => Object.assign({}, state, { schedule: 2 }),
  [booking.journeyUserDriverRespondSuccess]: (state) => Object.assign({}, state, { schedule: 3 }),

  [booking.journeyDriverHaveReached]: (state) => Object.assign({}, state, { schedule: 4 }),

  [booking.passengerEventDriverArrived]: (state) => Object.assign({}, state, { status: 'ARRIVED' }),
  [booking.passengerEventDriverOnBoard]: (state) => Object.assign({}, state, { status: 'ON_BOARD' }),
  
  [booking.journeyUpdateData]: (state, { payload }) => Object.assign({}, state, payload)
}, initialState)
