import { combineReducers } from 'redux'

import application from './reducer.application'
import account from './reducer.account'
import booking from './reducer.booking'
import storage_reducer from './reducer.storage'
import jobs from './reducer.jobs'
import circle from './reducer.circle'
import wallet from './reducer.wallet'
import intl from './reducer.intl'

import SwitchNavigator from '../../app.routes'
const initialState = SwitchNavigator.router.getStateForAction(SwitchNavigator.router.getActionForPathAndParams('AuthLoading'))
const navReducer = (state = initialState, action) => {
  const nextState = SwitchNavigator.router.getStateForAction(action, state);
  // console.log(`[NAVIGATION][ACTION][${action}]`, state, nextState)
  return nextState || state;
}

export default combineReducers({
  application,
  account,
  booking,
  jobs,
  circle,
  wallet,

  storage: storage_reducer,

  nav: navReducer,

  intl
})
