

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { circle, application } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

const DEFAULT_LIMIT = 50

function* fetchFriends() {
  while (true) {
    try {
      const { payload = {} } = yield take(circle.asyncFetchFriends().type)
      let { init = false, page = 'UNSET', limit = DEFAULT_LIMIT } = payload
      yield put(circle.setValues({ loading: true }))
      
      const circleReducer = yield select(state => ({ ...state.circle }))
      if (page === 'UNSET' && init) {
        page = 0
      } else 
      if (page === 'UNSET' && !init) {
        page = circleReducer.page + 1
      }

      let { requestor = { data: [] }, friend = { data: [] } } = yield all({
        requestor: call(Session.circle.get, 'v1/requests?skip=0&limit=50'),
        friend: call(Session.circle.get, `v1/circle?skip=${page * limit}&limit=${limit}`)
      })
      requestor = requestor.data
      friend = friend.data
      
      if (!init) {
        const clone = circleReducer.friend.splice(0)
        friend = clone.concat(friend)
      }

      yield put(circle.setValues({ loading: false, requestor, friend, page }))
    } catch (e) {
      console.log(e)
      // TODO
    }
  }
}

export default function* sagas() {
  yield all([
    fork(fetchFriends)
  ])
}