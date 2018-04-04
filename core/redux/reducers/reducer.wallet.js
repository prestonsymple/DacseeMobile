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
  
  [wallet.setValues]: (state, { payload }) => Object.assign({}, state, payload),
  [wallet.setBalanceValue]: (state, { payload }) => {    
    let lastState = state.selected_wallet
    lastState.availableAmount = lastState.availableAmount - payload.amount    
    return Object.assign({}, state, {selected_wallet: lastState})
  }

}, initialState)
