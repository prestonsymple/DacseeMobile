
/* global store */
/*eslint-disable no-unused-vars*/
import React, { Component, PureComponent } from 'react'
import { View, StatusBar, ActivityIndicator, NetInfo, AppState, NativeModules, BackHandler, PushNotificationIOS } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import moment from 'moment'
// import PushNotification from 'react-native-push-notification'
import PushService from './native/push-service'

import InteractionManager from 'InteractionManager'
/*eslint-enabled no-unused-vars*/

import Store from './app.store'
import Launch from './app.launch'
import { network, application } from './redux/actions'
import ShareUtil from './native/umeng/ShareUtil'

import { Define, System } from './utils'

const initializationModule = () => {}

/*eslint-disable*/
// console.ignoredYellowBox = ['Warning: BackAndroid', 'Remote debugger'];
/*eslint-enable*/

global.store = Store()

class Core extends PureComponent {

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
    
    //#AMap SDK Init
    this.initializationPushNotification()
    this.initializationMomentConfig()
    this.initializationApplicationLinstener()
    this.initializationBackHandler()
    this.initializationNetworkListener()
    this.initializationSocialConfig()
    // this.initializationPayment()
    // this.initializationLocation()
  }

  async initializationPushNotification() {
    // PushService.component.addEventListener('register', (handle) => {
    //   console.log('register', handle)
    // })

    // PushService.component.addEventListener('notification', async (handle) => {
    //   console.log(handle)
    //   const msg = await PushService.component.getInitialNotification()
    //   console.log(msg)
    // })

    // PushService.component.addEventListener('remoteFetch', (handle) => {
    //   console.log('remoteFetch', handle)
    // })

    // PushService.component.requestPermissions('')

    // const msg = await PushService.component.getInitialNotification()
    // console.log('init', msg)
    PushService.configure({
      onRegister: function(register) {
        console.log(register)
        const { token, os, baidu_id } = register
        const state = {
          push_service_token: token,
          baidu_user_id: baidu_id
        }
        if (System.Platform.iOS) delete state.baidu_user_id
        store.dispatch(application.setPushServiceToken(state))
      },
  
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        const { 
          foreground, // 正在前台
          id, // 推送ID
          message, // 推送消息内容
          title, // 推送标题
          userInteraction, // 用户触发 
          badge,
          route
        } = notification
        console.log('[PN][RECEIVED]', notification)

        // process the notification
        
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData)
      },
  
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: 'oDKwrgBkPKIyXpBsmVTx2dP3', // BAIDU TEST KEY
      senderID: 'dvzSIimOD9ipnqwssO5L1VNH', // AWS KEY

  
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
  
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
  
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true
    })
  }

  initializationSocialConfig() {
    ShareUtil.enabledDebug()
    // Weibo
    ShareUtil.setPlatformConfig(0, '3853690678', '8c509b8ac029138d30e07e74d8a174b7', '')
    // Wechat Session
    ShareUtil.setPlatformConfig(2, 'wx9e68b689aeabeee8', '65f8dc079438edcdcddca5b938823084', '')
    // Wechat Circle
    ShareUtil.setPlatformConfig(3, 'wx9e68b689aeabeee8', '65f8dc079438edcdcddca5b938823084', '')
    // QQ
    ShareUtil.setPlatformConfig(4, '1106730946', 'cpXqcASFJs2r6vH3', '')
    // Facebook
    ShareUtil.setPlatformConfig(16, '189854555110129', '5242579ad95a1347a9a55be82156e810', '')
    // Twitter
    ShareUtil.setPlatformConfig(17, '75sUPCwmmjb7R4VP8F7mIly8B', 'gBpNFDJ07FGO5dPQ8zlUFyzrr3KWd82RE6HWVQzyNfiXNbRyCX', '')
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
        <PersistGate loading={<ActivityIndicator size="small" color="#00ff00" />} persistor={store.persist}>
          <Launch />
        </PersistGate>
      </Provider>
    )
  }
}

export default Core