import { Keyboard } from 'react-native'

import { select, fork, all, take, call, put, takeEvery, takeLatest, race, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Toast from 'react-native-root-toast'

import { application, account } from '../actions'
import { NavigationActions } from 'react-navigation'
import { Session as session, System } from '../../utils'
import PushService from '../../native/push-service'

const STAGE_DEFINE = {
  INIT: 0,
  ENTER_MOBILE: 1,
  ENTER_MOBILE_COMPLATE: 2,
  VERIFICATION_CODE: 3,
  WAIT_RESPONSE: 4,
  READY_REGISTER: 5
}

function* loginFlow() {
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
          
          const { id, code, isMail, phoneCountryCode, _id = '' } = value
          const path = isMail ? 'v1/auth/email' : 'v1/auth/phone'
          const base = isMail ? 
            { email: id, emailVerificationCode: code, } : 
            { phoneCountryCode, phoneNo: id, phoneVerificationCode: code, _id: _id }

          const body = Object.assign({}, base, { latitude: 3.321, longitude: 1.23 })
          if (!body._id) {
            delete body._id
          }
          const { data }  = yield call(session.user.post, path, body)
          
          yield call(loginSuccess, data) // 登录成功

        } catch (e) {
          if (e.response && e.response.data.code == 'INVALID_VERIFICATION_CODE') {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()), 
              put(application.showMessage(e.response.data.message)),
            ])
          } else if (e.response && e.response.data.code === 'MULTIPLE_USER_ACCOUNT') {
            const { id, code, isMail, phoneCountryCode } = value
            const path = isMail ? 'v1/auth/email' : 'v1/auth/phone'
            const base = isMail ? 
              { email: id, emailVerificationCode: code, } : 
              { phoneCountryCode, phoneNo: id, phoneVerificationCode: code, _id1: id }
            const body = Object.assign({}, base, { latitude: 3.321, longitude: 1.23 })

            yield delay(1000)
            yield put(application.hideProgress())
            yield put(NavigationActions.navigate({ routeName: 'LoginSelectAccount', params: { data: e.response.data.data, value } }))
            yield put(account.loginPutValue(2))
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

          yield call(loginSuccess, data) // 登录成功

        } catch (e) {
          console.log(e)
          if (e.response && e.response.data.message === 'INVALID_REFERRAL') {
            yield all([
              put(application.hideProgress()), 
              put(application.showMessage(e.response.data.message)),
            ])
          } else if (e.response && e.response.data.message) {
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

function* logoutFlow() {
  while(true) {
    const payload = yield take(account.logoutSuccess().type)
    // yield delay(500)
    // TODO: CLEAN STATE && CACHE
  }
}

function* registerDevice() {
  while(true) {
    yield take(application.updatePushToken().type)
    const { token, userId, user_id, status } = yield select(state => ({ 
      token: state.config.push_service_token,
      userId: state.config.baidu_user_id,
      user_id: state.account.user._id,
      status: state.account.status
    }))

    if (!status) return;
    try {
      const extendFields = System.Platform.Android ? { channelId: token, userId } : { token }
      const postData = Object.assign({}, {
        'device' : {
          'available' : true, 
          'platform' : System.Platform.Android ? 'Android' : 'iOS', 
          'version' : System.Device.Version, 
          'uuid' : System.UUID, 
          'cordova' : '0.0.0', 
          'model' : System.Device.Name, 
          'manufacturer' : System.Device.Brand, 
          'isVirtual' : false, 
          'serial' : 'UNKNOW'
        }, 
        'status' : 'active',
        'type' : System.Platform.Name, 
        'uuid' : System.UUID,
        'user_id': user_id
      }, extendFields)
    
      yield call(session.push.post, 'v1/register', postData) 
    } catch (e) {
      console.log('[注册设备]', '[失败]', e)
    }
  }
}

function* loginSuccess(data: object) {
  yield put(account.setAccountValue(data))
  yield delay(2000)
  yield put(application.hideProgress())
  yield put(account.loginSuccess())
  yield put(application.updatePushToken())
}

export default function* watch() {
  yield all([
    fork(loginFlow),
    fork(logoutFlow),
    fork(registerDevice)
  ])
}