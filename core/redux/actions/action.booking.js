import { createAction } from 'redux-actions'

export default {
  passengerSetValue: createAction('PASSENGER_EVENT_SET_VALUE'), // 乘客端_设置状态

  passengerSetStatus: createAction('PASSENGER_EVENT_SET_STATUS'), // 乘客端_标记进度

  passengerSetID: createAction('PASSENGER_EVENT_SET_ID'), // 乘客端_设置状态

  passengerBoardCastListener: createAction('PASSENGER_BOARD_CAST_LISTENER'), // 乘客端_广播推送事件监听器
  passengerTriggerEventListener: createAction('PASSENGER_TRIGGER_EVENT_LISTENER') // 乘客端_触发事件监听器
}
