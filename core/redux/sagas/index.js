import { Platform } from 'react-native'
import { fork, all, take, call, put, takeEvery, takeLatest, apply } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { NavigationActions, NavigationState } from 'react-navigation'
import CodePush from 'react-native-code-push'


import { application, account } from '../actions'
import { System } from '../../utils'
import { loginSaga, logoutSaga } from './saga.login'
import bookingSaga from './saga.booking'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchClientVersion(action) {
  try {
    const { payload } = action
    if (payload !== 'inactive') return

    const remoteBundle = yield call(CodePush.checkForUpdate)
    if (!remoteBundle) return
    
    yield delay(1000)

    yield put(application.startUpdate(remoteBundle))
  } catch (e) {
    console.log(e)
  }
}

function* watchiOSDrawerEvent() {
  while(true) {
    yield take(application.openDrawer().type)
    // yield put(application.hideStatusBar())
    // yield put(application.showStatusBar())
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
  }
}

function* watchAndroidDrawerEvent() {
  while(true) {
    yield take(application.openDrawer().type)
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
  }
}

function* watchAndroidBackButton() {
  while (true) {
    yield take(application.onPressAndroidBackButton().type)
    yield put(NavigationActions.back())
  }
}

export default function* sagaService() {
  yield all([
    takeLatest(application.changeApplicationStatus().type, watchClientVersion),
    fork(Platform.select({ ios: watchiOSDrawerEvent, android: watchAndroidDrawerEvent })),
    fork(bookingSaga),
    fork(watchAndroidBackButton),

    fork(logoutSaga),
    fork(loginSaga)
  ])
}