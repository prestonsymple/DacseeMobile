import { Platform } from 'react-native'
import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { application, account } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchLoginDemo() {
  while(true) {
    yield take(account.requestVerify().type)
    yield put(application.darkStatusBar())
    yield put(account.loginSuccess())
  }
}

function* watchClientVersion() {
  while(true) {
    yield take('TODO_CLIENT_VERSION_CHECK')
  }
}

function* watchiOSDrawerEvent() {
  while(true) {
    yield take(application.openDrawer().type)
    yield put(application.hideStatusBar())
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))

    yield take(application.closeDrawer/* callback */)
    yield put(application.showStatusBar())
  }
}

function* watchAndroidDrawerEvent() {
  while(true) {
    yield take(application.openDrawer().type)
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
  }
}

export default function* sagaService() {
  yield all([
    fork(Platform.select({ ios: watchiOSDrawerEvent, android: watchAndroidDrawerEvent })),
    fork(watchLoginDemo)
  ])
}