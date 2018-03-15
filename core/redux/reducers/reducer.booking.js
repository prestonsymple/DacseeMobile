'use strict'

import {
  booking
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  to: {},
  from: {},
  type: 'circle',
  name: '优选',
  payment: '现金支付',
  book: false,
  time: 'now',
  selected_friends: [],

  status: 0
}

export default handleActions({
  [booking.passengerSetValue]: (state, { payload }) => Object.assign({}, state, payload),
  [booking.passengerSetStatus]: (state, { payload }) => Object.assign({}, state, { status: payload }),
}, initialState)
