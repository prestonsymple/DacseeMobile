

import { fork, all, take, call, put, takeEvery, takeLatest, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { circle, application } from '../actions'
import { NavigationActions } from 'react-navigation'
import { System, Session } from '../../utils'

const DEFAULT_LIMIT =20

function* fetchFriends() {
  while (true) {
    const { payload = {} } = yield take(circle.asyncFetchFriends().type)
    let { init = false, page = 'UNSET', limit = DEFAULT_LIMIT } = payload
    yield put(circle.setValues({ loading: true }))

    const circleReducer = yield select(state => ({ ...state.circle }))
    try {
      if (page === 'UNSET' && init) {
        page = 0
      } else 
      if (page === 'UNSET' && !init) {
        page = circleReducer.page + 1
      }

      let { requestor, friend } = yield all({
        requestor: call(Session.Circle.Get, 'v1/requests?skip=0&limit=20'),
        friend: call(Session.Circle.Get, `v1/circle?skip=${page * limit}&limit=${limit}`)
      })
      // if(friend.lenght<limit){
      //   yield put(circle.setValues({ more: false }))
      // }
      if (!init) {
        const clone = circleReducer.friend.splice(0)
        friend = clone.concat(friend)
      } else {
        yield delay(500)
      }

      yield put(circle.setValues({ loading: false, requestor, friend, page }))
    } catch (e) {
      if (circleReducer.friend.lenght !== 0 || circleReducer.requestor.length !== 0) {
        yield put(circle.setValues({ loading: false, requestor: circleReducer.requestor, friend: circleReducer.friend, page: page }))
      } else {
        yield put(circle.setValues({ loading: false, requestor: [], friend: [], page: page }))
      }
    }
  }
}

function* updateFriendsLocation() {
  while(true) {
    const selected_friends = yield select(state => state.booking.selected_friends)
    try {
      if (selected_friends && Array.isArray(selected_friends) && selected_friends.length > 0) {
        const params = selected_friends.map(pipe => pipe.friend_id).join(',')
        let friends_location = yield call(Session.Location.Get, `v1/friends?reqUser_id=${params}`)
        friends_location = friends_location.filter(pipe => (pipe.latitude && pipe.longitude))
        yield put(circle.setValues({ friends_location }))
      } else {
        yield put(circle.setValues({ friends_location: [] }))
      }
    } catch (e) {
      /* */
    } finally {
      yield delay(5000)
    }
  }
}

export default function* sagas() {
  yield all([
    fork(fetchFriends),
    fork(updateFriendsLocation)
  ])
}