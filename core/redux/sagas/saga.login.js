import { fork, all, take, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { application } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System } from '../../utils'




export default function* watchLogin() {
  while(true) {
    yield take('等待用户发起登录动作')
    yield call('请求远程服务器进行登录')
    yield put('更新状态到State')
    yield take('等待用户输入验证码')
    yield call('请求远程服务器验证短信验证码')
    yield put('更新结果到State')
    yield put('更新State为登录成功')

    yield take('等待用户发起注销动作')
    yield call('请求远程服务器进行注销')
    yield put('更新State为已注销')
  }
}