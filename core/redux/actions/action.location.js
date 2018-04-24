import { createAction } from 'redux-actions'

export default {
  putLocation: createAction('PUT_LOCATION'),
  putDragRegion: createAction('PUT_DRAG_REGION'),

  saveReducer: createAction('!!LOCATION_SAVE_REDUCER!!'),
}
