import { createAction, createActions } from 'redux-actions'



// LOGIN ACTIONS
const LOGIN_ACTIONS = createActions({},
  'ACCOUNT_VERIFICATION_CODE_INPUT_COMPLETION',
  'ACCOUNT_VERIFICATION_CODE_VAILD',
  'ACCOUNT_VERIFICATION_CODE_TYPO',

  'ACCOUNT_GOTO_REGISTER',
  'ACCOUNT_GOTO_LOGIN',

  'ACCOUNT_LOGIN_SUCCESS',
  'ACCOUNT_LOGIN_FAIL',

  'ACCOUNT_LOGOUT_SUCCESS',

  'ACCOUNT_ENTER_LOGIN',
  'ACCOUNT_ENTER_LOGOUT'
)

export default {
  accountEnterLogin: LOGIN_ACTIONS.accountEnterLogin,
  accountEnterLogout: LOGIN_ACTIONS.accountEnterLogout,
  accountGotoLogin: LOGIN_ACTIONS.accountGotoLogin,
  accountGotoRegister: LOGIN_ACTIONS.accountGotoRegister,
  accountLoginFail: LOGIN_ACTIONS.accountLoginFail,
  accountLoginSuccess: LOGIN_ACTIONS.accountLoginSuccess,
  accountLogoutSuccess: LOGIN_ACTIONS.accountLogoutSuccess,
  accountVerificationCodeInputCompletion: LOGIN_ACTIONS.accountVerificationCodeInputCompletion,
  accountVerificationCodeTypo: LOGIN_ACTIONS.accountVerificationCodeTypo,
  accountVerificationCodeVaild: LOGIN_ACTIONS.accountVerificationCodeVaild
}
