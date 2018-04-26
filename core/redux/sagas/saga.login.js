import { Keyboard } from 'react-native'

import { select, fork, all, take, call, put, takeEvery, takeLatest, race, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import Toast from 'react-native-root-toast'

import { application, account, booking, jobs, circle, driver } from '../actions'
import { NavigationActions } from 'react-navigation'
import { Session as session, System } from '../../utils'
import PushService from '../../native/push-service'

const STAGE_DEFINE = {
  INIT: 0,
  ENTER_MOBILE: 1,
  ENTER_MOBILE_COMPLATE: 2,
  VERIFICATION_CODE: 3,
  WAIT_RESPONSE: 4,
  READY_REGISTER: 5,
  BIND_PHONE:6,
  REGISTER_MULT:7
}

function* loginWithEmail(value,data){

}
function* loginFlow() {

  while (true) {
    const i18n = yield select(state => state.intl.messages||{})
    const { next, back } = yield race({
      next: take(account.loginNext().type),
      back: take(account.loginBack().type)
    })

    if (back) {
      yield put(account.loginPutValue(back.payload))
    }

    if (next) {
      let { stage, value } = next.payload
      // 输完手机号&&邮箱
      //TODO 需要验证账号是否存在&&发送验证码||转至注册状态
      if (stage === STAGE_DEFINE.ENTER_MOBILE_COMPLATE) { 
        const { isMail ,id }=value
        try {
          let url =isMail? 'v1/auth/email': 'v1/sendVerificationCode/phone'
          let body=isMail? {email:id} : value
          yield call(session.User.Post, url, body)
          yield put(application.showMessage(i18n.alert_sent_code))
        } catch (e) {
          //alert(JSON.stringify(e.response))
          if(e.response && e.response.data.code == 'MULTIPLE_USER_ACCOUNT'){
            //选择账号
            yield put(NavigationActions.navigate({ routeName: 'LoginSelectAccount', params: { data: e.response.data.data, value,type:'EMAIL_LOGIN' } }))
            // if(e.response.data.data.length>1){
            //   yield call(loginWithEmail, value,e.response.data.data)
            // }
            //如果是邮箱绑定了手机，则返回手机号，单账号
           
          }else if(e.response && e.response.data.code =='MISSING_INPUT'){
            //邮箱单账号登录
            try {
              yield put(application.setMailModeValue({phone_info:e.response.data.data}))
              yield call(session.User.Post, 'v1/sendVerificationCode/phone', e.response.data.data)
              yield put(account.loginPutValue(2))
            } catch (e) {
              console.log(' e.response.data', e.response.data)
            }
          } else if(e.response && e.response.data.code =='INVALID_USER'){
            //如果账号不存在,转至注册界面
            yield put(account.loginPutValue(4))
          } else if (e.response && e.response.data.code == 'VERIFICATION_CODE_RESEND_WAIT') {
            yield put(application.showMessage(`${i18n.server_busy_code}[${e.response.data.data}]${i18n.seconds_later}`))
          } else {
            yield put(application.showMessage('无法连接到服务器，请稍后再试'))
          }
          continue
        }
      }

      if (stage === STAGE_DEFINE.VERIFICATION_CODE) { // 输入验证码
        try {
          yield all([
            put(account.loginPutValue(3)),
            put(application.showProgress())
          ])
          let { id, code, isMail, phoneCountryCode, _id = '' } = value
          // 邮箱登录模式 - 二次验证码
          if (!_id) {
            _id = yield select(state => state.application.mail_login_mode_id)
            yield put(application.setMailModeValue(undefined))
          }
          
          const path = isMail ? 'v1/auth/email' : 'v1/auth/phone'
          const base = isMail ?
            { email: id, phoneVerificationCode: code, _id } :
            { phoneCountryCode, phoneNo: id, phoneVerificationCode: code, _id }

          const body = Object.assign({}, base, { latitude: 3.321, longitude: 1.23 })
          if (!body._id) {
            delete body._id
          }
          const data = yield call(session.User.Post, path, body)

          yield call(loginSuccess, data) // 登录成功

        } catch (e) {
          let { isMail, id } = value
          if (e.response && (
            e.response.data.code == 'INVALID_VERIFICATION_CODE' ||
            e.response.data.code == 'INVALID_PHONE_VERIFICATION_CODE' ||
            e.response.data.code == 'INVALID_MAIL_VERIFICATION_CODE'
          )) {
            yield all([
              put(account.loginPutValue(2)),
              put(application.hideProgress()),
              put(application.showMessage(e.response.data.message)),
            ])
          } else if (e.response && e.response.data.code === 'MULTIPLE_USER_ACCOUNT') {
            const { id, code, phoneCountryCode } = value
            const path = isMail ? 'v1/auth/email' : 'v1/auth/phone'
            const base = isMail ?
              { email: id, emailVerificationCode: code, } :
              { phoneCountryCode, phoneNo: id, phoneVerificationCode: code, _id1: id }
            const body = Object.assign({}, base, { latitude: 3.321, longitude: 1.23 })

            yield delay(400)
            yield put(application.hideProgress())
            yield put(NavigationActions.navigate({ routeName: 'LoginSelectAccount', params: { data: e.response.data.data, value,type:'PHONE_LOGIN' } }))
            yield put(account.loginPutValue(2))
          } else if (e.response && (
            e.response.data.code == 'INVALID_USER' ||
            e.response.data.code == 'INCOMPLETE_REGISTRATION'
          )) { // 跳转注册
            const actions = [
              put(account.loginPutValue(4)),
              put(application.hideProgress())
            ]
            if (e.response.data.data && e.response.data.data.fullName) actions.push(put(application.setFullValue(e.response.data.data.fullName)))
            if (e.response.data.data && e.response.data.data.referralUserId) actions.push(put(application.setReferrerValue(e.response.data.data.referralUserId)))
            yield all(actions)
          } else if (e.response && e.response.data.code == 'MISSING_PHONE_VERIFICATION_CODE' && isMail) {
            const url = 'v1/sendVerificationCode/email'
            yield call(session.User.Post, url, { email: id })
            yield all([
              put(application.hideProgress()),
              put(application.showMessage(i18n.alert_sent_code)),
              put(account.loginPutValue(2))
            ])
          } else {
            const flow = [
              put(application.hideProgress()),
              put(application.showMessage('无法连接到服务器，请稍后再试')),
            ]
            if (isMail) {
              flow.push(put(account.loginPutValue(1)))
            } else {
              flow.push(put(account.loginPutValue(2)))
            }
            yield all(flow)
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
          // alert(JSON.stringify( Object.assign({},
          //   value,
          //   { latitude: 3.321, longitude: 1.23 }
          // )))
          const register = yield call(session.User.Post, 'v1/register', Object.assign({},
            value,
            { latitude: 3.321, longitude: 1.23 }
          ))
          
          yield put(application.showMessage(i18n.account_activated))
          yield call(loginSuccess, register) // 登录成功

        } catch (e) {
          if (e.response && e.response.data.message === 'INVALID_REFERRAL') {
            yield all([
              put(application.hideProgress()),
              put(application.showMessage(e.response.data.message)),
            ])
          }else if (e.response && e.response.data.code === 'MULTIPLE_USER_ACCOUNT') {
            yield put(application.hideProgress())
            yield put(NavigationActions.navigate({ routeName: 'LoginSelectAccount', params: { data: e.response.data.data, value,type:'BIND_PHONE' } }))
            //失败返回账号输入处
          } else if (e.response && e.response.data.message) {
            yield all([
              put(account.loginPutValue(1)),
              put(application.hideProgress()),
              put(application.showMessage(e.response.data.message)),
            ])
          } else {
            yield all([
              put(account.loginPutValue(1)),
              put(application.hideProgress()),
              put(application.showMessage('无法连接到服务器，请稍后再试')),
            ])
          }
          continue
        }
      }
      if (stage === STAGE_DEFINE.BIND_PHONE) {
        try {
          yield all([
            put(account.loginPutValue(6)),
            put(application.showProgress())
          ])
          const register=yield call(session.User.Post, 'v1/register/bind',value)
          yield call(loginSuccess, register) // 登录成功
        } catch (e) {
          yield put(application.showMessage('无法连接到服务器，请稍后再试'))
        }
        continue
      }
      if (stage === STAGE_DEFINE.REGISTER_MULT) {
        try {
          yield put(account.loginPutValue(7))
          const register=yield call(session.User.Post, 'v1/register/multi',value)
          yield call(loginSuccess, register) // 登录成功
        } catch (e) {
          yield put(application.showMessage('无法连接到服务器，请稍后再试'))
        }
        continue
      }

      yield put(account.loginPutValue(stage))
    }
  }
}

function* logoutFlow() {
  while(true) {
    const payload = yield take(account.asyncLogout().type)
    try {
      yield call(session.Push.Put, 'v1/unsubscribe', { uuid: System.UUID })
    } catch (e) {
      /*  */
    } finally {
      yield put(account.saveLogout())
      yield put(circle.setValues({ friend: [], requestor: [], loading: false, page: 0 }))
      yield put(driver.driverSetValue({ booking_id: '', detail: {}, route: {}, jobs: [], working: false, status: '' }))
      yield put(booking.passengerSetValue({ type: 'circle', name: '优选', payment: '现金支付', book: false, time: 'now', selected_friends: [] }))
      yield put(account.loginPutValue(0))
      yield put(NavigationActions.navigate({ routeName: 'AuthLoading' }))
    }
  }
}

function* registerDevice() {
  while(true) {
    yield take(application.updatePushToken().type)
    const { token, userId, user_id, status } = yield select(state => ({
      token: state.storage.push_service_token,
      userId: state.storage.baidu_user_id,
      user_id: state.account.user._id,
      status: state.account.status
    }))

    if (!status) return
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

      yield call(session.Push.Post, 'v1/register', postData)
    } catch (e) {
      // console.info('[推送][注册设备][失败]')
    }
  }
}

function* loginSuccess(data: object) {
  yield put(account.saveLogin(data))
  yield put(application.hideProgress())
  yield put(application.updatePushToken())
}

export default function* watch() {
  yield all([
    fork(loginFlow),
    fork(logoutFlow),
    fork(registerDevice)
  ])
}
