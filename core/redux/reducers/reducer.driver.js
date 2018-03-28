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
  [driver.newJobs]: (state, { payload }) => Object.assign({}, state, { booking_id: payload }),

  [driver.setJobs]: (state, { payload }) => Object.assign({}, state, payload),

  [driver.acceptJobs]: (state) => Object.assign({}, state, { working: true }),
  [driver.cancelJobs]: (state) => Object.assign({}, state, { status: '', working: false, detail: {}, route: {} })
}, initialState)
