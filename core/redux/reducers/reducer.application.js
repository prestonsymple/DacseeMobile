'use strict'

import {
  application
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  application_status: 'active',
  
  update_remote_bundle: null,

  status_bar_hidden: false,
  progress_modal_visible: false
}

export default handleActions({

  [application.changeApplicationStatus]: (state, { payload }) => Object.assign({}, state, { application_status: payload }),

  [application.startUpdate]: (state, { payload }) => Object.assign({}, state, { update_remote_bundle: payload }),
  [application.finshUpdate]: (state) => Object.assign({}, state, { update_remote_bundle: null }),

  [application.hideStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: true }),
  [application.showStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: false }),

  [application.showProgress]: (state) => Object.assign({}, state, { progress_modal_visible: true }),
  [application.hideProgress]: (state) => Object.assign({}, state, { progress_modal_visible: false })
  
}, initialState)
