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
  payment: 'Cash',
  book: false,
  time: 'now',
  fare: 0,
  notes: '',
  selected_friends: [],

  vehicleGroups: [],

  status: 0,
  driver_id: '',
  driver: {},
  driver_info: {}
}

export default handleActions({
  [booking.passengerSetValue]: (state, { payload }) => Object.assign({}, state, payload),
  [booking.passengerSaveStatus]: (state, { payload }) => Object.assign({}, state, { status: payload }),
}, initialState)
