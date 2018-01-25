import { createActions } from 'redux-actions'

// BOOKING ACTIONS
const JOURNEY_ACTIONS = createActions({},
  'JOURNEY_USER_START', // 行程开始
  'JOURNEY_USER_CANCEL', // 行程取消
  'JOURNEY_USER_COMPLATE', // 行程完成 [开始 - 确认 - 上车 - 到达 - 支付 - 评价 - 完成]

  'JOURNEY_USER_WAIT_DRIVER_RESPOND', // 等待司机相应

  'JOURNEY_USER_DRIVER_RESPOND_SUCCESS', // 司机已接单
  'JOURNEY_USER_DRIVER_RESPOND_FAIL', // 司机拒绝

  'JOURNEY_USER_ABOARD_CAR', // 用户已确认上车
  
  'JOURNEY_UPDATE_DATA', // 更新行程信息

  'JOURNEY_DRIVER_HAVE_REACHED', // 行程已到达终点 [-> 显示付款信息]
  'JOURNEY_WAITING_PAYMENT', // 等待付款消息

  'JOURNEY_WAITING_FEEDBACK' // 等待用户评论
)

export default {
  journeyDriverHaveReached: JOURNEY_ACTIONS.journeyDriverHaveReached,
  journeyUpdateData: JOURNEY_ACTIONS.journeyUpdateData,
  journeyUserAboardCar: JOURNEY_ACTIONS.journeyUserAboardCar,
  journeyUserCancel: JOURNEY_ACTIONS.journeyUserCancel,
  journeyUserComplate: JOURNEY_ACTIONS.journeyUserComplate,
  journeyUserDriverRespondFail: JOURNEY_ACTIONS.journeyUserDriverRespondFail,
  journeyUserDriverRespondSuccess: JOURNEY_ACTIONS.journeyUserDriverRespondSuccess,
  journeyUserStart: JOURNEY_ACTIONS.journeyUserStart,
  journeyUserWaitDriverRespond: JOURNEY_ACTIONS.journeyUserWaitDriverRespond,
  journeyWaitingFeedback: JOURNEY_ACTIONS.journeyWaitingFeedback,
  journeyWaitingPayment: JOURNEY_ACTIONS.journeyWaitingPayment
}
