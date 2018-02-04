'use strict'

import {
  application
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {

  status_bar_style: 'light-content'
  
}

export default handleActions({

  [application.darkStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'dark-content' }),
  [application.lightStatusBar]: (state) => Object.assign({}, state, { status_bar_style: 'light-content' }),

}, initialState)
