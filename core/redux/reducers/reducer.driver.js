'use strict'

import {
  driver
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  booking_id: '',
  detail: {},
  route: {},
  jobs: [],
  working: false,
  status: ''
}

export default handleActions({

  [driver.driverSetValue]: (state, { payload }) => Object.assign({}, state, payload),
  [driver.driverSaveStatus]: (state, { payload }) => Object.assign({}, state, { status: payload }),

}, initialState)
