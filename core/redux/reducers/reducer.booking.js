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
  selected_friends: []
}

export default handleActions({
  [booking.journeyUserCancel]: (state, { payload }) => Object.assign({}, state, { schedule: 0 }),
  [booking.journeyUserComplate]: (state, { payload }) => Object.assign({}, state, { schedule: 0 }),

  [booking.journeyUserStart]: (state, { payload }) => Object.assign({}, state, { schedule: 1 }),

  [booking.journeyUserWaitDriverRespond]: (state, { payload }) => Object.assign({}, state, { schedule: 2 }),
  [booking.journeyUserDriverRespondSuccess]: (state, { payload }) => Object.assign({}, state, { schedule: 3 }),
  
  [booking.journeyUpdateData]: (state, { payload }) => Object.assign({}, state, payload)
}, initialState)
