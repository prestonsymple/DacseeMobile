import { Platform } from 'react-native'
import { fork, all, take, call, put, takeEvery, takeLatest, apply } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { NavigationActions, NavigationState } from 'react-navigation'
import CodePush from 'react-native-code-push'
import Toast from 'react-native-root-toast'

import { application, account } from '../actions'
import { System, Session } from '../../utils'
import loginSaga from './saga.login'
import passengerSaga from './saga.passenger'
import driverSaga from './saga.driver'
import circleSaga from './saga.circle'
import networkSaga from './saga.network'
import restoreSaga from './saga.restore'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchShowMessage() {
  while (true) {
    const { payload } = yield take(application.showMessage().type)
    const title = typeof(payload) === 'object' ? payload.title : payload
    const options = typeof(payload) === 'object' ? payload.options : {}
    Toast.show(title, Object.assign({}, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
    }, options))
  }
}

export default function* sagaService() {
  yield all([
    fork(restoreSaga),
    fork(watchShowMessage),

    fork(passengerSaga),
    fork(driverSaga),
    
    fork(loginSaga),
    fork(circleSaga),

    fork(networkSaga)
  ])
}