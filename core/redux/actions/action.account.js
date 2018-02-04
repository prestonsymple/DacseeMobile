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

  loginSuccess: LOGIN_ACTIONS.loginSuccess,
  loginFail: LOGIN_ACTIONS.loginFail,
  
  logoutSuccess: LOGIN_ACTIONS.logoutSuccess
}
