'use strict'

import {
  application
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {

  status_bar_style: 'light-content',

  push_service: {
    android: {
      appid: '',
      userId: '',
      channelId: '',
      requestId: ''
    },
    ios: {
      token: ''
    }
  }
  
}

export default handleActions({

  [application.darkStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'dark-content' }),
  [application.lightStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'light-content' }),

  [application.setPushServiceParams]: (state, { payload }) => Object.assign({}, state, { push_service: payload })

}, initialState)
