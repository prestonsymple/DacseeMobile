/* global navigator */
import moment from 'moment'

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { application, account, booking, intl } from '../actions'
import { Session } from '../../utils'

const oncePosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(p => resolve(p), e => reject(e), { timeout: 2500 }))
// const permissionsCheck = (permission) => Permissions.check(permission)
// const permissionsReqeust = (permission) => Permissions.request(permission)


function* initializationFlow(action) {
  const save_language = yield select(state => state.account.language)
  yield put(intl.update(save_language))
}

export default function* initializationSaga() {
  yield takeLatest(action => {
    const { type } = action
    return (
      (type === 'persist/REHYDRATE')
      // || 
      // (type === application.changeApplicationStatus().type) ||
      // (type === application.updatePushToken().type) || 
      // (type === account.saveLogin().type) ||
      // (type === application.updateLocationStatus().type)
    )
  }, initializationFlow)
}