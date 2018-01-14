import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { ActApplication } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'




export default function* watchLogin() {
  while(true) {
    yield take('LOGIN_EVENT')
    yield call('REQUEST_REMOTE_SERVICE')
    yield put('CHANGE_LOGIN_STEP')

    yield take('LOGIN_OUT_EVENT')
    yield call('REQUEST_REMOTE_SERVICE')
    yield put('CHANGE_LOGIN_STEP')
  }
}