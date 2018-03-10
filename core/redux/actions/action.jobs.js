import { createAction } from 'redux-actions'

export default {
  newJobs: createAction('BOOKING_NEW_JOBS'),
  setJobs: createAction('BOOKING_SET_JOBS'),

  showJobsDetail: createAction('BOOKING_SHOW_JOBS_DETAIL'),
  hideJobsDetail: createAction('BOOKING_HIDE_JOBS_DETAIL'),
  acceptJobs: createAction('BOOKING_ACCEPT_JOBS'),
  cancelJobs: createAction('BOOKING_CANCEL_JOBS'),
  rejectJobs: createAction('BOOKING_REJECT_JOBS'),
  onBoardJobs: createAction('BOOKING_ON_BOARD_JOBS'),
  onCompleteJobs: createAction('BOOKING_ON_COMPLETE_JOBS')
}
