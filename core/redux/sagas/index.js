import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { ActApplication } from '../actions'
import { NavigationActions } from 'react-navigation'


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

function* watchNavigatorDrawer() {
  while(true) {
    yield take(ActApplication.openDrawer)
    yield put({ type: ActApplication.hideStatusBar })
    yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))

    yield take(ActApplication.closeDrawer)
    yield put({ type: ActApplication.showStatusBar })
  }
}

export default function* sagaService() {
  yield all([
    fork(watchNavigatorDrawer),
  ])
}