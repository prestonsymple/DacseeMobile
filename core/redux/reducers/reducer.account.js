'use strict'

import {
  account
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  status: false,
  // status: true, // LOGIN TEST
  login_step: 0
}

export default handleActions({
  [account.accountEnterLogin]: (state, { payload }) => Object.assign({}, state, { login_step: payload }),

  // TODO: SET ACCOUNT DATA
  [account.accountLoginSuccess]: (state, { payload }) => Object.assign({}, state, { status: true }),

  // TODO: DELETE ACCOUNT DATA
  [account.accountLogoutSuccess]: (state, { payload }) => Object.assign({}, state, { status: false }),
}, initialState)
