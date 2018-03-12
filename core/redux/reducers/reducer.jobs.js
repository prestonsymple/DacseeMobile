'use strict'

import {
  jobs
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  booking_id: '',
  detail: {},
  route: {},
  working: false,
  status: ''
}

export default handleActions({
  [jobs.newJobs]: (state, { payload }) => Object.assign({}, state, { booking_id: payload }),

  [jobs.setJobs]: (state, { payload }) => Object.assign({}, state, payload),

  [jobs.acceptJobs]: (state) => Object.assign({}, state, { working: true }),
  [jobs.cancelJobs]: (state) => Object.assign({}, state, { status: '', working: false, detail: {}, route: {} })
}, initialState)
