import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { ActApplication } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchClientVersion() {
  while(true) {
    yield take('TODO_CLIENT_VERSION_CHECK')
  }
}

function* watchNavigatorDrawerEvent() {
  while(true) {
    yield take(ActApplication.openDrawer)
    if (System.Platform.iOS) yield put({ type: ActApplication.hideStatusBar })
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))

    yield take(ActApplication.closeDrawer)
    if (System.Platform.iOS) yield put({ type: ActApplication.showStatusBar })
  }
}

export default function* sagaService() {
  yield all([
    fork(watchNavigatorDrawerEvent),
  ])
}