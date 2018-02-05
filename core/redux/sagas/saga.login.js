import { Keyboard } from 'react-native'

import { fork, all, take, call, put, takeEvery, takeLatest, race, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Toast from 'react-native-root-toast'

import { application, account } from '../actions'
import { NavigationActions } from 'react-navigation'
import { Session as session } from '../../utils'

const STAGE_DEFINE = {
  INIT: 0,
  ENTER_MOBILE: 1,
  ENTER_MOBILE_COMPLATE: 2,
  VERIFICATION_CODE: 3,
  WAIT_RESPONSE: 4,
  READY_REGISTER: 5
}

const PUT_SCREEN_DEFINE = {

}

function* loginSaga() {
  while (true) {
    const { next, back } = yield race({
      next: take(account.loginNext().type),
      back: take(account.loginBack().type)
    })

    if (back) {
      yield put(account.loginPutValue(back.payload))
    }

    if (next) {
      const { stage, value } = next.payload

      if (stage === STAGE_DEFINE.ENTER_MOBILE_COMPLATE) { // 输入手机号&&邮箱
        try {
          const is = ('email' in value)
          const path = is ? 'v1/sendVerificationCode/email' : 'v1/sendVerificationCode/phone'
          yield call(session.user.post, path, value)
          yield put(application.showMessage(`已将验证码发送至您的${is ? '邮箱' : '手机'}`))
        } catch (e) {
          yield put(application.showMessage('无法连接到服务器，请稍后再试'))
          continue
        }
      }

      if (stage === STAGE_DEFINE.VERIFICATION_CODE) { // 输入验证码
        try {
          yield all([
            put(account.loginPutValue(3)), 
            put(application.showProgress())
          ])

          const { id, code, isMail } = value
          const path = isMail ? 'v1/auth/email' : 'v1/auth/phone'
          const base = isMail ? 
            { email: id, emailVerificationCode: code, } : 
            { phoneCountryCode: '+86', phoneNo: id, phoneVerificationCode: code, _id1: '' }

          const body = Object.assign({}, base, { latitude: 3.321, longitude: 1.23 })
          const { data }  = yield call(session.user.post, path, body)
          
          yield all([ // 登录完成
            delay(500),
            put(account.setAccountValue(data)),
            delay(1000),
            put(application.hideProgress()),
            delay(500),
            put(account.loginSuccess())
          ])
        } catch (e) {
          if (e.response && e.response.data.code == 'INVALID_VERIFICATION_CODE') {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()), 
              put(application.showMessage(e.response.data.message)),
            ])
          } else if (e.response && e.response.data.code == 'INVALID_USER') { // 跳转注册
            yield all([
              put(account.loginPutValue(4)),
              put(application.hideProgress())
            ])
          } else {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()), 
              put(application.showMessage('无法连接到服务器，请稍后再试')),
            ])
          }
          continue
        }
      }

      if (stage === STAGE_DEFINE.READY_REGISTER) {
        try {
          yield all([
            put(account.loginPutValue(3)), 
            put(application.showProgress())
          ])

          const register = yield call(session.user.post, 'v1/register', Object.assign({}, 
            value, 
            { latitude: 3.321, longitude: 1.23 }
          ))

          const { data } = yield call(session.user.post, 'v1/auth/phone', { 
            phoneCountryCode: value.phoneCountryCode, 
            phoneNo: value.phoneNo, 
            phoneVerificationCode: value.phoneVerificationCode, 
            _id1: ''
          })

          yield all([ // 登录完成
            delay(500),
            put(account.setAccountValue(data)),
            delay(1000),
            put(application.hideProgress()),
            delay(500),
            put(account.loginSuccess())
          ])

        } catch (e) {
          if (e.response && e.response.data.message) {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()), 
              put(application.showMessage(e.response.data.message)),
            ])
          } else {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()), 
              put(application.showMessage('无法连接到服务器，请稍后再试')),
            ])
          }
          continue
        }
      }

      yield put(account.loginPutValue(stage))
    }
  }
}

function* logoutSaga() {
  while(true) {
    const payload = yield take(account.logoutSuccess().type)
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