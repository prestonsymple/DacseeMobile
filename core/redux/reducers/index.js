import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistCombineReducers } from 'redux-persist'

import application from './reducer.application'
import account from './reducer.account'
import booking from './reducer.booking'
import config from './reducer.config'
import jobs from './reducer.jobs'
import circle from './reducer.circle'

import AppNavigator from '../../app.routes'
const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('AuthLoading'))
const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}

export default combineReducers({
  application,
  account,
  booking,
  config,
  jobs,
  circle,



  nav: navReducer
})
