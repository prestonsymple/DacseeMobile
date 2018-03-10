import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistCombineReducers } from 'redux-persist'

import application from './reducer.application'
// import { LoginNav, HomeNav } from './reducer.navigator'
import account from './reducer.account'
import booking from './reducer.booking'
import config from './reducer.config'
import jobs from './reducer.jobs'

export default combineReducers({
  application,
  account,
  booking,
  config,
  jobs
})
