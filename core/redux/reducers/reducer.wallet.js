'use strict'

import {
  wallet
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  walletList: [],
  selected_wallet: {},
  bank_info:{},
  bank_list:[]
}

export default handleActions({
  
  [wallet.setValues]: (state, { payload }) => Object.assign({}, state, payload),
  [wallet.setBalanceValue]: (state, { payload }) => {    
    let lastState = state.selected_wallet
    lastState.availableAmount = lastState.availableAmount - payload.amount    
    return Object.assign({}, state, {selected_wallet: lastState})
  },
  [wallet.updateBankInfo]: (state, { payload }) =>  Object.assign({}, state, payload),
  [wallet.setBankValue]:(state, { payload }) => Object.assign({}, state, payload)

}, initialState)
