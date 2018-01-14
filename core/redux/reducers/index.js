import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistCombineReducers } from 'redux-persist'

import application from './reducer.application'
import { LoginNav, HomeNav } from './reducer.navigator'
import account from './reducer.account'

export default combineReducers({
  application,
  account,






  loginNav: LoginNav,
  homeNav: HomeNav
})
