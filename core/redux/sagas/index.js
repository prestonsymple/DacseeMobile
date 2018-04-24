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
import initSaga from './saga.init'
import locationSaga from './saga.location'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// function* watchClientVersion(action) {
//   try {
//     const { payload } = action
//     console.log(payload)
//     if (payload !== 'inactive') return

//     console.log('[检查更新]')
//     const remoteBundle = yield call(CodePush.checkForUpdate)
//     console.log('[BUNDLE]', remoteBundle)
//     if (!remoteBundle) return
    
//     yield delay(1000)

//     yield put(application.startUpdate(remoteBundle))
//   } catch (e) {
//     console.log(e)
//   }
// }

// function* watchiOSDrawerEvent() {
//   while(true) {
//     yield take(application.openDrawer().type)
//     // yield put(application.hideStatusBar())
//     // yield put(application.showStatusBar())
//     yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
//   }
// }

// function* watchAndroidDrawerEvent() {
//   while(true) {
//     yield take(application.openDrawer().type)
//     yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
//   }
// }

// function* watchNetworkStatus() {
//   while (true) {
//     const status = yield take(application.changeNetworkStatus().type)
//     console.log(status)
//   }
// }

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
    // takeLatest(application.changeApplicationStatus().type, watchClientVersion),
    // fork(Platform.select({ ios: watchiOSDrawerEvent, android: watchAndroidDrawerEvent })),
    fork(initSaga),
    fork(watchShowMessage),

    fork(passengerSaga),
    fork(driverSaga),
    
    fork(loginSaga),
    fork(circleSaga),

    fork(networkSaga),
    fork(locationSaga)
  ])
}