import { createAction, createActions } from 'redux-actions'



// LOGIN ACTIONS
const LOGIN_ACTIONS = createActions({},
  'LOGIN_NEXT',
  'LOGIN_BACK',

  'LOGIN_STAGE_THROW_ERROR',
  'LOGIN_STAGE_ERROR_CLEAR',

  'LOGIN_SUCCESS',
  'LOGIN_FAIL',

  'LOGOUT_SUCCESS'
)

export default {
  loginNext: LOGIN_ACTIONS.loginNext,
  loginBack: LOGIN_ACTIONS.loginBack,

  loginSuccess: LOGIN_ACTIONS.loginSuccess,
  loginFail: LOGIN_ACTIONS.loginFail,
  
  logoutSuccess: LOGIN_ACTIONS.logoutSuccess
}
