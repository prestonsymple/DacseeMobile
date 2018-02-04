
/* global store */
/*eslint-disable no-unused-vars*/
import React, { Component, PureComponent } from 'react'
import { View, StatusBar, ActivityIndicator, NetInfo, AppState, NativeModules, BackHandler } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import moment from 'moment'

import InteractionManager from 'InteractionManager'
import CodePush from 'react-native-code-push'
/*eslint-enabled no-unused-vars*/

import Store from './app.store'
import Launch from './app.launch'
import { network, application } from './redux/actions'

import { Define } from './utils'

const initializationModule = () => {}

/*eslint-disable*/
// console.ignoredYellowBox = ['Warning: BackAndroid', 'Remote debugger'];
/*eslint-enable*/

global.store = Store()

export default class Core extends Component {

  constructor(props) {
    super(props)
    this.state = {
      store,
      refresh: ''
    }
    this.connected = true
    // this.watch = { location: null }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()

    store.dispatch(application.changeApplicationStatus('inactive')) // CHECK UPDATE
    //#AMap SDK Init
    // this.initializationStorePersist()
    this.initializationMomentConfig()
    this.initializationApplicationLinstener()
    this.initializationBackHandler()
    this.initializationNetworkListener()
    // this.initializationPayment()
    // this.initializationLocation()
  }

  componentWillUnmount() {
    // navigator.geolocation.clearWatch(this.watchID);
  }

  initializationBackHandler() {
    if (Define.system.android) {
      BackHandler.addEventListener('hardwareBackPress', () => store.dispatch(application.onPressAndroidBackButton()))
    }
  }

  initializationMomentConfig() {
    moment.defineLocale('CUSTOM_TIME_LOCALE', {
      relativeTime : {
        future: '%s后',
        past: '%s前',
        s:  '%d秒',
        m:  '1分钟',
        mm: '%d分钟',
        h:  '1小时',
        hh: '%d小时',
        d:  '1天',
        dd: '%d天',
        M:  '1个月',
        MM: '%d个月',
        y:  '1年',
        yy: '%d年'
      }
    })
  }

  // initializationStorePersist() {
  //   // store.persist
  //   /* 监听Store */
  //   // store.subscribe(() => {
  //   //   if (store.getState().account.logined)
  //   // })
  // }
  
  initializationPayment() {
  }
  /* 监听位置信息 */
  // initializationLocation() {
  //   const success = (position) => {
  //     program.message(`位置更新 - ${position.coords.latitude}|${position.coords.longitude}`)
  //   }
  //   const error = (error) => { console.log(error) }
  //   const options = { enableHighAccuracy: true, timeout: 60000, maximumAge: 0, distanceFilter: 15 }
  //   this.watch.location = navigator.geolocation.watchPosition(success, error, options)
  // }

  initializationNetworkListener() {
    NetInfo.addEventListener('connectionChange', ({ type, effectiveType }) => {
      store.dispatch(application.changeNetworkStatus(type))
    })
  }

  initializationApplicationLinstener() {
    AppState.addEventListener('change', (state) => store.dispatch(application.changeApplicationStatus(state)))
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <PersistGate loading={null} persistor={store.persist}>
          <Launch />
        </PersistGate>
      </Provider>
    )
  }
}
