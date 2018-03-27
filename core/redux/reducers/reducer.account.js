'use strict'

import {
  account
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  status: false,
  authToken: '',
  user: {},
  location: { lat: 0, lng: 0, latitude: 0, longitude: 0 }
}

export default handleActions({
  // TODO: SET ACCOUNT DATA
  [account.loginSuccess]: (state, { payload }) => Object.assign({}, state, { status: true }),

  // TODO: DELETE ACCOUNT DATA
  [account.logoutSuccess]: (state, { payload }) => Object.assign({}, state, { status: false, authToken: '' }),

  [account.setAccountValue]: (state, { payload }) => Object.assign({}, state, payload),

  [account.updateLocation]: (state, { payload }) => Object.assign({}, state, { location: payload }),
}, initialState)
