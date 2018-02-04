import { Keyboard } from 'react-native'

import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Toast from 'react-native-root-toast'

import { application, account } from '../actions'
import { NavigationActions } from 'react-navigation'
import { Session as session } from '../../utils'

function* sendVerificationCode({ payload }) {
  try {
    const path = payload.isMail ? 'v1/sendVerificationCode/email' : 'v1/sendVerificationCode/phone'
    const { data } = yield call(session.user.post, path, payload.body)
    if (!data) throw new Error()
  } catch (e) {
    Toast.show('遇到错误，请返回后重试', {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
    })
  }
  
}

function verificationCode(params) {
  // const payload = yield take(account.accountVerificationCodeInputCompletion().type)
  // yield put(account.accountEnterLogin(1))
  // yield delay(500)
  
  // yield put(application.showProgress())
  // yield delay(3000) // TODO: REPLACE FETCH API
  // yield put(application.hideProgress())

  // yield delay(500)
  // yield put(application.darkStatusBar())
  // yield put(account.accountLoginSuccess())
}

function* loginSaga() {
  yield all([
    takeLatest(account.accountSendVerificationCode().type, sendVerificationCode),
    takeLatest(account.accountVerificationCodeInputCompletion().type, verificationCode)
  ])
}

function* logoutSaga() {
  while(true) {
    const payload = yield take(account.accountEnterLogout().type)
    yield put(NavigationActions.back())
    // yield delay(500)
    // TODO: CLEAN STATE && CACHE
    yield put(account.accountLogoutSuccess())
  }
}


export {
  logoutSaga,
  loginSaga
}