'use strict'

import {
  application,
  account
} from '../actions'

import _ from 'lodash'

import { handleActions } from 'redux-actions'

const initialState = {
  application_status: 'active',
  network_status: '',
  
  update_remote_bundle: null,

  status_bar_hidden: false,
  progress_modal_visible: false,
  
  // throw_error: [],
  referrerValue: undefined,

  login_stage: 0
}

export default handleActions({
  [account.loginPutValue]: (state, { payload }) => Object.assign({}, state, { login_stage: payload }),

  [application.changeApplicationStatus]: (state, { payload }) => Object.assign({}, state, { application_status: payload }),
  [application.changeNetworkStatus]: (state, { payload }) => Object.assign({}, state, { network_status: payload }),

  [application.startUpdate]: (state, { payload }) => Object.assign({}, state, { update_remote_bundle: payload }),
  [application.finshUpdate]: (state) => Object.assign({}, state, { update_remote_bundle: null }),

  [application.hideStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: true }),
  [application.showStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: false }),

  [application.showProgress]: (state) => Object.assign({}, state, { progress_modal_visible: true }),
  [application.hideProgress]: (state) => Object.assign({}, state, { progress_modal_visible: false }),

  [application.setReferrerValue]: (state, { payload }) => Object.assign({}, state, { referrerValue: payload }),

  // [application.throwErrorMessage]: (state, { payload }) => {
  //   const clone = state.throw_error
  //   clone.push(payload)
  //   // Object.assign({}, state, { })
  //   // throw_error: _.cloneDeep(state.throw_error)
  // },
  
}, initialState)
