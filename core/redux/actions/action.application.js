import { createAction } from 'redux-actions'

export default {
  changeApplicationStatus: createAction('CHANGE_APPLICATION_STATUS'),
  changeNetworkStatus: createAction('CHANGE_NETWORK_STATUS'),

  setReferrerValue: createAction('SET_REFERRER_VALUE'),

  darkStatusBar: createAction('DARK_STATUS_BAR'),
  lightStatusBar: createAction('LIGHT_STATUS_BAR'),
  
  hideStatusBar: createAction('HIDE_STATUS_BAR'),
  showStatusBar: createAction('SHOW_STATUS_BAR'),
  showProgress: createAction('SHOW_PROGRESS_MODAL'),
  hideProgress: createAction('HIDE_PROGRESS_MODAL'),

  checkUpdate: createAction('APPLICATION_CHECK_UPDATE'),
  startUpdate: createAction('APPLICATION_START_UPDATE'),
  finshUpdate: createAction('APPLICATION_FINSH_UPDATE'),

  onPressAndroidBackButton: createAction('APPLICATION_ON_PRESS_BACK_BUTTON'),

  setPushServiceToken: createAction('APPLICATION_SET_PUSH_SERVICE_TOKEN'),
  
  showMessage: createAction('APPLICATION_SHOW_MESSAGE')
}
