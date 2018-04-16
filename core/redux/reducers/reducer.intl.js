'use strict'

import { intl } from '../actions'
import { zh_cn, en_mas, en_us } from '../../i18n'
import { handleActions } from 'redux-actions'

const initialState = {
  messages: en_us,
  locale: 'en'
}

export default handleActions({
  
  [intl.update]: (state, { payload }) => {
    let _state = {
      messages: en_us,
      locale: 'en'
    }
    switch(payload) {
    case 'zh-CN':
      _state.messages = zh_cn
      _state.locale = 'zh'
      break
    case 'mas':
      _state.messages = en_mas
      _state.locale = 'mas'
      break
    case 'en-US':
      _state.messages = en_us
      _state.locale = 'en'
      break
    default:
      break
    }
    
    return Object.assign({}, state, _state)
  },

}, initialState)
