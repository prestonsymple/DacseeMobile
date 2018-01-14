'use strict'

import { DeviceEventEmitter } from 'react-native'
import { HomeNavigator, LoginNavigator } from '../../app.routes'

const HomeNav = (state, action) => {
  const newState = HomeNavigator.router.getStateForAction(action, state);
  return newState || state;
}

const LoginNav = (state, action) => {
  const newState = LoginNavigator.router.getStateForAction(action, state);
  return newState || state;
}

export {
  HomeNav,
  LoginNav
}
