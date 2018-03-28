import { createAction } from 'redux-actions'

export default {
  newJobs: createAction('DRIVER_NEW_JOBS'),
  setJobs: createAction('DRIVER_SET_JOBS'),

  showJobsDetail: createAction('DRIVER_SHOW_JOBS_DETAIL'),
  hideJobsDetail: createAction('DRIVER_HIDE_JOBS_DETAIL'),
  acceptJobs: createAction('DRIVER_ACCEPT_JOBS'),
  cancelJobs: createAction('DRIVER_CANCEL_JOBS'),
  rejectJobs: createAction('DRIVER_REJECT_JOBS'),
  onBoardJobs: createAction('DRIVER_ON_BOARD_JOBS'),
  onCompleteJobs: createAction('DRIVER_ON_COMPLETE_JOBS')
}
