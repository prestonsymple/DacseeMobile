import { createAction } from 'redux-actions'

export default {
  driverSetValue: createAction('DRIVER_EVENT_SET_VALUE'), // 乘客端_设置状态

  driverSetStatus: createAction('DRIVER_EVENT_SET_STATUS'), // 乘客端_将状态设置到SAGA
  driverSaveStatus: createAction('DRIVER_EVENT_SAGA_SET_STATUS'), // 乘客端_不要在SAGA外的地方手动调用该ACTION, 将状态设置到REDUCER

  driverSetID: createAction('DRIVER_EVENT_SET_ID'), // 乘客端_设置状态

  driverBoardCastListener: createAction('DRIVER_BOARD_CAST_LISTENER'), // 乘客端_广播推送事件监听器
  driverTriggerEventListener: createAction('DRIVER_TRIGGER_EVENT_LISTENER') // 乘客端_触发事件监听器
}
