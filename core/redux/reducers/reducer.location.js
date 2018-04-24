'use strict'

import {
  location
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  location: {
    latitude: 0,
    longitude: 0
  },
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0
  }
}

export default handleActions({

  [location.saveReducer]: (state, { payload }) => Object.assign({}, state, payload)

}, initialState)
