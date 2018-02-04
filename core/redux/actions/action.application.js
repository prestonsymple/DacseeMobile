import { createAction } from 'redux-actions'

export default {
  changeApplicationStatus: createAction('CHANGE_APPLICATION_STATUS'),

  darkStatusBar: createAction('DARK_STATUS_BAR'),
  lightStatusBar: createAction('LIGHT_STATUS_BAR'),
  
  hideStatusBar: createAction('HIDE_STATUS_BAR'),
  showStatusBar: createAction('SHOW_STATUS_BAR'),

  openDrawer: createAction('DRAWER_OPEN'),
  closeDrawer: action => {
    if (action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') return true
    return false
  },

  showProgress: createAction('SHOW_PROGRESS_MODAL'),
  hideProgress: createAction('HIDE_PROGRESS_MODAL'),

  navigateTo: createAction('NAVIGATE_TO'),

  checkUpdate: createAction('APPLICATION_CHECK_UPDATE'),
  startUpdate: createAction('APPLICATION_START_UPDATE'),
  finshUpdate: createAction('APPLICATION_FINSH_UPDATE'),

  onPressAndroidBackButton: createAction('APPLICATION_ON_PRESS_BACK_BUTTON')
}
