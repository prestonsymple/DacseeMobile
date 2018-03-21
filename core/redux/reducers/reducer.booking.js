'use strict'

import {
  booking
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  destination: {},
  from: {},
  type: 'circle',
  name: '优选',
  payment: '现金支付',
  book: false,
  time: 'now',
  fare: 0,
  selected_friends: [],

  status: 0
}

export default handleActions({
  [booking.passengerSetValue]: (state, { payload }) => Object.assign({}, state, payload),
  [booking.passengerSaveStatus]: (state, { payload }) => Object.assign({}, state, { status: payload }),
}, initialState)
