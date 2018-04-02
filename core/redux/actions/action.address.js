import { createAction } from 'redux-actions'

export default {
  setValues: createAction('ADDRESS_SET_VALUES'),
  addAddressValue: createAction('Add_ADDRESS_VALUE')
}