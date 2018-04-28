import { createAction } from 'redux-actions'

export default {
  run: createAction('!!APP_EVENT_TRIGGER_RUN'),
  trigger: createAction('!!APP_EVENT_TRIGGER_STOP'),
  stop: createAction('!!APP_EVENT_TRIGGER_STOP')
}