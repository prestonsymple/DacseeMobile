'use strict'

import { intl } from '../actions'
import { zh_cn, en_mas, en_us } from '../../i18n'
import { handleActions } from 'redux-actions'

const initialState = {
  locale: 'en',
  messages: en_us,
  formats: undefined
}

export default handleActions({
  
  [intl.update]: (state, { payload }) => {
    let msgs = {}
    switch(payload) {
    case 'zh':
      msgs = zh_cn
      break
    case 'mas':
      msgs = en_mas
      break
    case 'en':
      msgs = en_us
      break
    default:
      msgs = en_us
      break
    }
    return Object.assign({}, state, { locale: payload, messages: msgs })
  },

}, initialState)
