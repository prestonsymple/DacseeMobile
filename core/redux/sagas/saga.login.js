import { Keyboard } from 'react-native'

import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, account } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'

function* loginSaga() {
  while(true) {
    const payload = yield take(account.accountVerificationCodeInputCompletion().type)
    yield put(account.accountEnterLogin(1))
    yield delay(500)
    
    yield put(application.showProgress())
    yield delay(3000) // TODO: REPLACE FETCH API
    yield put(application.hideProgress())

    yield delay(500)
    yield put(application.darkStatusBar())
    yield put(account.accountLoginSuccess())

    // yield 
    // yield take('等待用户发起登录动作')
    // yield call('请求远程服务器进行登录')
         // yield put('更新状态到State')
    // yield take('等待用户输入验证码')
    // yield call('请求远程服务器验证短信验证码')
    // yield put('更新结果到State')
    // yield put('更新State为登录成功')

    // yield take('等待用户发起注销动作')
    // yield call('请求远程服务器进行注销')
    // yield put('更新State为已注销')
  }
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