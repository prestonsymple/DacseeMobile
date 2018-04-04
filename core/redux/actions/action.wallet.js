import { createAction } from 'redux-actions'

export default {
  setValues: createAction('WALLET_SET_VALUES'),
  setBalanceValue: createAction('WALLET_SET_BALANCE_VALUE')
}
