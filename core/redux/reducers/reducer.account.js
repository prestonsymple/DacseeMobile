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

  [account.saveLogin]: (state, { payload }) => Object.assign({}, state, { ...payload, status: true }),
  [account.saveLogout]: (state) => Object.assign({}, state, Object.assign({}, { status: false, authToken: '' })),

  [account.setAccountValue]: (state, { payload }) => Object.assign({}, state, payload),

  [account.updateLocation]: (state, { payload }) => Object.assign({}, state, { location: payload }),
}, initialState)
