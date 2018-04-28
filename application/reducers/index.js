import { combineReducers } from 'redux'

// import application from './reducer.application'
// import account from './reducer.account'
// import booking from './reducer.booking'
// import storage_reducer from './reducer.storage'
// import driver from './reducer.driver'
// import circle from './reducer.circle'
// import wallet from './reducer.wallet'
// import intl from './reducer.intl'
// import address from './reducer.address'
// import location from './reducer.location'

// import SwitchNavigator from '../navigator'
// const initialState = SwitchNavigator.router.getStateForAction(SwitchNavigator.router.getActionForPathAndParams('AuthLoading'))
// const navReducer = (state = initialState, action) => {
//   const nextState = SwitchNavigator.router.getStateForAction(action, state)
//   return nextState || state
// }

export default combineReducers({
  nav: (state = { a: 1 }, action) => {
    // const nextState = SwitchNavigator.router.getStateForAction(action, state)
    return { a: 2 } || state
  },

  // application,
  // account,
  // booking,
  // driver,
  // circle,
  // wallet,
  // address,
  // location,
  //
  // storage: storage_reducer,
  // intl
})
