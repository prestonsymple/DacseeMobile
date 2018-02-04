'use strict'

import {
  account
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  status: false
}

export default handleActions({
  // TODO: SET ACCOUNT DATA
  [account.loginSuccess]: (state, { payload }) => Object.assign({}, state, { status: true }),

  // TODO: DELETE ACCOUNT DATA
  [account.logoutSuccess]: (state, { payload }) => Object.assign({}, state, { status: false }),
}, initialState)
