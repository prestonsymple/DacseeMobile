import { createAction } from 'redux-actions'

export default {
  asyncFetchFriends: createAction('CIRCLE_ASYNC_FETCH_FRIENDS'),

  setValues: createAction('CIRCLE_SET_VALUES')
}
