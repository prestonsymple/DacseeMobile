'use strict'

import {
  wallet
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  walletList: [],
  selected_wallet: {}
}

export default handleActions({
  
  [wallet.setValues]: (state, { payload }) => Object.assign({}, state, payload)

}, initialState)
