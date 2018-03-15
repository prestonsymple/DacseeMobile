import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistCombineReducers } from 'redux-persist'

import application from './reducer.application'
import account from './reducer.account'
import booking from './reducer.booking'
import storage_reducer from './reducer.storage'
import jobs from './reducer.jobs'
import circle from './reducer.circle'

import AppNavigator from '../../app.routes'
const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('AuthLoading'))
const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // console.log(`[NAVIGATION][ACTION][${action}]`, state, nextState)
  return nextState || state;
}

export default combineReducers({
  application,
  account,
  booking,
  storage: storage_reducer,
  jobs,
  circle,



  nav: navReducer
})
