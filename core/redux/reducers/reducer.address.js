'use strict'

import {
  address
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  favorite: []
}

export default handleActions({
  
  [address.setValues]: (state, { payload }) => Object.assign({}, state, payload)

}, initialState)