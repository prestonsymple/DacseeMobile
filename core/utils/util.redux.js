import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export default {
  connectAndBindAction: (stateFilter, action) => {
    return connect(stateFilter, dispatch => bindActionCreators(action, dispatch))
  }
}