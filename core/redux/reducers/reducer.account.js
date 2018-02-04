'use strict'

import {
  account
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  status: false,
  stage: 0
}

export default handleActions({
  [account.loginNext]: (state, { payload }) => Object.assign({}, state, { stage: payload || state.stage + 1 }),
  [account.loginBack]: (state, { payload }) => Object.assign({}, state, { stage: payload || state.stage - 1 }),

  // TODO: SET ACCOUNT DATA
  [account.loginSuccess]: (state, { payload }) => Object.assign({}, state, { status: true }),

  // TODO: DELETE ACCOUNT DATA
  [account.logoutSuccess]: (state, { payload }) => Object.assign({}, state, { status: false }),
}, initialState)
