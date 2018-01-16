import { createAction } from 'redux-actions'

export default {
  requestLogin: createAction('USER_REQUEST_LOGIN'),
  requestVerify: createAction('USER_REQUEST_VERIFY'),
  loginSuccess: createAction('LOGIN_STATUS_SUCCESS'),

  requestLogout: createAction('USER_REQUEST_LOGOUT'),
  logoutSuccess: createAction('LOGOUT_STATUS_SUCCESS')
}
