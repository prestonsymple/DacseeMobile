'use strict'

import {
  ActApplication
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  status: false
}

export default handleActions({
}, initialState)
