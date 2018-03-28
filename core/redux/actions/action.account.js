import { createAction, createActions } from 'redux-actions'



// LOGIN ACTIONS
const LOGIN_ACTIONS = createActions({},
  'LOGIN_NEXT',
  'LOGIN_BACK',
  'LOGIN_PUT_VALUE',

  'SET_ACCOUNT_VALUE',

  'LOGIN_SUCCESS',
  'LOGIN_FAIL',

  'LOGOUT_SUCCESS'
)

export default {
  loginNext: LOGIN_ACTIONS.loginNext,
  loginBack: LOGIN_ACTIONS.loginBack,
  loginPutValue: LOGIN_ACTIONS.loginPutValue,

  setAccountValue: LOGIN_ACTIONS.setAccountValue,

  // asyncLogin: createAction('ACCOUNT_ASYNC_LOGIN'),
  saveLogin: createAction('ACCOUNT_SAVE_LOGIN'),
  
  asyncLogout: createAction('ACCOUNT_ASYNC_LOGOUT'),
  saveLogout: createAction('ACCOUNT_SAVE_LOGOUT'),

  updateLocation: createAction('ACCOUNT_UPDATE_LOCATION')
}
