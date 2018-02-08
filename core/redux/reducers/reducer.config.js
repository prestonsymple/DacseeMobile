'use strict'

import {
  application
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {

  status_bar_style: 'light-content',

  push_service_token: '',
  baidu_user_id: ''
  
}

export default handleActions({

  [application.darkStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'dark-content' }),
  [application.lightStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'light-content' }),

  [application.setPushServiceToken]: (state, { payload }) => Object.assign({}, state, payload)

}, initialState)
