'use strict'

import {
  application
} from '../actions'

import { handleActions } from 'redux-actions'

const initialState = {
  application_status: 'active',

  status_bar_style: 'light-content',
  status_bar_hidden: false,
}

export default handleActions({
  [application.changeApplicationStatus]: (state, { payload }) => Object.assign({}, state, { application: payload }),

  [application.hideStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: true }),
  [application.showStatusBar]: (state) => Object.assign({}, state, { status_bar_hidden: false }),
  // [application.changeApplicationState]: (state, { payload }) => Object.assign({}, state, { application: payload }),

  // [application.toggleProgress]: (state,  _) => Object.assign({}, state, { progress: !state.progress }),
  // [application.showProgress]: (state, _) => Object.assign({}, state, { progress: true }),
  // [application.hideProgress]: (state, _) => Object.assign({}, state, { progress: false }),

  [application.darkStatusBar]: (state, _) => Object.assign({}, state, { status_bar_style: 'dark-content' }),
  [application.lightStatusBar]: (state, _) => Object.assign({}, state, { status_bar_style: 'light-content' }),

  // [application.showPreviewImage]: (state, { payload = {} }) => Object.assign({}, state, { previewImageVisible: true, previewImageSet: payload }),
  // [application.hidePreviewImage]: (state, _) => Object.assign({}, state, { previewImageVisible: false, previewImageSet: {} }),

  // [application.showCameraPicker]: (state, { payload = { onSuccess: () => {}, onCancel: () => {} } }) => {
  //   return Object.assign({}, state, { cameraPickerVisible: true, previewImageEvent: payload })
  // },
  // [application.hideCameraPicker]: (state, _) => Object.assign({}, state, { cameraPickerVisible: false, previewImageEvent: {} }),

  // [application.showPreviewVideo]: (state, { payload = {} }) => Object.assign({}, state, { previewVideo: true, previewVideoParams: payload }),
  // [application.hidePreviewVideo]: (state, _) => Object.assign({}, state, { previewVideo: false, previewVideoParams: {} }),

  // [application.setGlobalSetting]: (state, { payload = {} }) => Object.assign({}, state, { globalSetting: payload }),

}, initialState)
