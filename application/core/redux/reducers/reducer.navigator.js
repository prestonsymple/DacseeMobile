'use strict'

import { DeviceEventEmitter } from 'react-native'
import { AppNavigator } from '../../app.routes'


export default (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
};
