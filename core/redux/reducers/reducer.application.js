'use strict'

import {
  application,
  account,
  driver
} from '../actions'

import _ from 'lodash'

import { handleActions } from 'redux-actions'

const initialState = {
  application_status: 'active',
  network_status: '',
  
  update_remote_bundle: null,

  status_bar_hidden: false,
  progress_modal_visible: false,
  
  // throw_error: [],
  referrerValue: undefined,
  fullValue: undefined,
  mail_login_mode_id: undefined,

  login_stage: 0,

  hud_modal_visible: false,

  core_mode: 'passenger', // 首页TAB
  map_mode: '', // 地图模块
  gps_access: true, // gps权限

  api_maps: { // API代理映射
    main: [
      'https://user-dev.dacsee.io/',
      'https://circle-dev.dacsee.io/',
      'https://booking-dev.dacsee.io/',
      'https://location-dev.dacsee.io/',
      'https://driver-verification-dev.dacsee.io/',
      'https://push-dev.dacsee.io/',
      'https://lookup-dev.dacsee.io/',
      'https://wallet-dev.dacsee.io/'
    ],
    agent: [
      'http://47.98.40.59/'
    ]
  }
}

export default handleActions({
  [account.loginPutValue]: (state, { payload }) => Object.assign({}, state, { login_stage: payload }),

  [application.changeApplicationStatus]: (state, { payload }) => Object.assign({}, state, { application_status: payload }),
  [application.changeNetworkStatus]: (state, { payload }) => Object.assign({}, state, { network_status: payload }),

  [application.startUpdate]: (state, { payload }) => Object.assign({}, state, { update_remote_bundle: payload }),
  [application.finshUpdate]: (state) => Object.assign({}, state, { update_remote_bundle: null }),

  [application.hideStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: true }),
  [application.showStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: false }),

  [application.showProgress]: (state) => Object.assign({}, state, { progress_modal_visible: true }),
  [application.hideProgress]: (state) => Object.assign({}, state, { progress_modal_visible: false }),

  [application.setReferrerValue]: (state, { payload }) => Object.assign({}, state, { referrerValue: payload }),
  [application.setFullValue]: (state, { payload }) => Object.assign({}, state, { fullValue: payload }),
  [application.setMailModeValue]: (state, { payload }) => Object.assign({}, state, { mail_login_mode_id: payload }),

  [driver.showJobsDetail]: (state) => Object.assign({}, state, { show_driver_order: true }),
  [driver.hideJobsDetail]: (state) => Object.assign({}, state, { show_driver_order: false }),

  [driver.cancelJobs]: (state) => Object.assign({}, state, { show_driver_order: false }),

  [application.setCoreMode]: (state, { payload }) => Object.assign({}, state, { core_mode: payload }),
  [application.setMapMode]: (state, { payload }) => Object.assign({}, state, { map_mode: payload }),

  [application.showHUD]: (state) => Object.assign({}, state, { hud_modal_visible: true }),
  [application.hideHUD]: (state) => Object.assign({}, state, { hud_modal_visible: false }),

  [application.setValues]: (state, { payload }) => Object.assign({}, state, payload),

}, initialState)
