'use strict'

import {
  circle
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  friend: [],
  requestor: [],
  loading: false,
  friends_location: [],
  page: 0
}

export default handleActions({
  
  [circle.setValues]: (state, { payload }) => Object.assign({}, state, payload)

}, initialState)
