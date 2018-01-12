import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistCombineReducers } from 'redux-persist'

import application from './reducer.application'
import nav from './reducer.navigator'

// import account from './reducer.account'

export default combineReducers({
  application,
  nav
  // account
  // control: require('./reducer.control').default,
  // member: require('./reducer.member').default,
  // location: require('./reducer.location').default,
  // class: require('./reducer.class').default,
  // account: require('./reducer.account').default,
  // banner: require('./reducer.banner').default,
  // goods: require('./reducer.goods').default
})
