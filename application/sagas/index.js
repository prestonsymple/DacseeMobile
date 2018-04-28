import { fork, all, take, call, put, takeEvery, takeLatest, apply } from 'redux-saga/effects'
import { delay } from 'redux-saga'

export default function* sagaService() {
  yield take('!!xx')
}