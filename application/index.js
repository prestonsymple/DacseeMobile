import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/lib/integration/react'
import {connect} from 'react-redux'

import Store from './index.store'

class ApplicationCore extends PureComponent {

  static PersistGateLoading = connect(() => ({}))(class PersistGateLoading extends PureComponent {
    constructor(props) {
      super(props)
    }

    componentWillUnmount() {
      console.log('[注销]')
    }

    render() {
      return (null)
    }
  })

  static LaunchEventHook = (props) => {
    console.log(props)
    return (
      <View style={{backgroundColor: 'red', height: 200}}>

      </View>
    )
  }

  static store = Store()
  static utils = {
    store: ApplicationCore.store,
    define: {
      func: {
        /**
         * 空的CALL结构
         */
        object: () => ({}),
        null: () => null,
        undefined: () => undefined
      }
    }
  }

  constructor(props) {
    super(props)
    global.$$ = ApplicationCore.utils
  }

  render() {
    return (
      <Provider store={ApplicationCore.store}>
        <PersistGate loading={<ApplicationCore.PersistGateLoading/>} persistor={ApplicationCore.store.persist}>
          <ApplicationCore.LaunchEventHook/>
        </PersistGate>
      </Provider>
    )
  }
}

export default ApplicationCore