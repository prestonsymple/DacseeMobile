import { Platform } from 'react-native'
import { fork, all, take, call, put, takeEvery, takeLatest, apply } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { NavigationActions, NavigationState } from 'react-navigation'
import CodePush from 'react-native-code-push'
import Toast from 'react-native-root-toast'

import { application, account } from '../actions'
import { System } from '../../utils'
import loginSaga from './saga.login'
import bookingSaga from './saga.booking'
import jobsSaga from './saga.jobs'


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

function* watchAndroidBackButton() {
  while (true) {
    yield take(application.onPressAndroidBackButton().type)
    yield put(NavigationActions.back())
  }
}

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
    fork(watchAndroidBackButton),
    fork(watchShowMessage),

    fork(bookingSaga),
    fork(loginSaga),
    fork(jobsSaga)
  ])
}