
/* global store */
/*eslint-disable no-unused-vars*/
import React, { Component, PureComponent } from 'react'
import { View, StatusBar, ActivityIndicator, NetInfo, AppState, NativeModules, BackHandler, PushNotificationIOS, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { Text } from 'react-native'
import { PersistGate } from 'redux-persist/lib/integration/react'
import moment from 'moment'
import intl from 'intl'
import { addLocaleData } from 'react-intl'
// import PushNotification from 'react-native-push-notification'
import PushService from './native/push-service'

import zhLocaleData from 'react-intl/locale-data/zh'
import masLocaleData from 'react-intl/locale-data/mas'
import enLocaleData from 'react-intl/locale-data/en'
import Sound from 'react-native-sound'
import InteractionManager from 'InteractionManager'
/*eslint-enabled no-unused-vars*/

import Store from './app.store'
import Launch from './app.launch'
import { network, application, jobs, booking } from './redux/actions'
import { BOOKING_STATUS } from './route/main'
import ShareUtil from './native/umeng/ShareUtil'

import { Define, System } from './utils'

const initializationModule = () => { }

const SHARE_MEDIA = {
  WECHAT_SESSION: Platform.select({ ios: 1, android: 2 }),
  WECHAT_CIRCLE: Platform.select({ ios: 2, android: 3 }),
  SINA_WEIBO: Platform.select({ ios: 0, android: 1 }),
  TENCENT_QQ: Platform.select({ ios: 4, android: 0 }),
  TENCENT_QQ_ZONE: Platform.select({ ios: 5, android: 4 }),
  FACEBOOK: Platform.select({ ios: 16, android: 13 }),
  TWITTER: Platform.select({ ios: 17, android: 8 })
}

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
    this.initializationi18n()
    this.initializationRingTone()
    this.initializationPushNotification()
    this.initializationMomentConfig()
    this.initializationApplicationLinstener()
    this.initializationBackHandler()
    this.initializationNetworkListener()
    this.initializationSocialConfig()
    // this.initializationPayment()
    // this.initializationLocation()
  }

  initializationi18n() {
    addLocaleData([...zhLocaleData, ...masLocaleData, ...enLocaleData])
  }

  initializationRingTone() {
    new Sound('dacsee.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) return console.log('[加载铃声][失败]', error)
    })
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
      onRegister: function (register) {
        const { token, os, baidu_id } = register
        const state = {
          push_service_token: token,
          baidu_user_id: baidu_id
        }
        if (System.Platform.iOS) delete state.baidu_user_id
        store.dispatch(application.setPushServiceToken(state))
        store.dispatch(application.updatePushToken())
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: async function (notification) {
        const {
          foreground, // 正在前台
          id, // 推送ID
          message, // 推送消息内容
          title, // 推送标题
          userInteraction, // 用户触发 
          badge,
          route,
          data
        } = notification

        console.log('[RECEVIED][MESSAGE]', notification)

        const { custom_data = {} } = data

        if ('booking_id' in custom_data) {
          const { booking_id, status } = custom_data
          if (!foreground) await new Promise(resolve => setTimeout(() => resolve(), 1000))
          const _status = status.toUpperCase()

          /* DRIVER */
          if (_status === 'PENDING_ACCEPTANCE') { // 等待接受的订单
            store.dispatch(jobs.newJobs(booking_id))
          } else if (_status === 'CANCELLED_BY_PASSENGER') { // 由乘客取消
          } else if (_status === 'COMPLETED') { // 完成订单
          }

          /* PASSENGER */
          if (_status === 'CANCELLED_BY_DRIVER' ||
            _status === 'ON_THE_WAY' ||
            _status === 'ARRIVED' ||
            _status === 'NO_SHOW' ||
            _status === 'ON_BOARD' ||
            _status === 'NO_TAKER' ||
            _status === 'COMPLETED'
          ) {
            store.dispatch(booking.passengerBoardCastListener({ action: _status, booking_id: booking_id }))
          } else {
            console.log('[未处理的]', _status)
          }

          // if (_status === 'CANCELLED_BY_DRIVER') { // 司机取消
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS()))
          //   store.dispatch(application.showMessage('您的行程已被拒绝'))
          // } else if (_status === 'ON_THE_WAY') { // 司机接单-已在路上
          //   store.dispatch(booking.passengerSetValue(booking_id))
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ON_THE_WAY()))
          // } else if (_status === 'ARRIVED') { // 已到达
          //   store.dispatch(booking.passengerSetValue(booking_id))
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED()))
          // } else if (_status === 'NO_SHOW') { // 未找到乘客
          //   // store.dispatch(booking.passengerSetValue(booking_id))
          //   // store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED()))
          // } else if (_status === 'ON_BOARD') { // 行驶中
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_ON_BOARD()))
          // } else if (_status === 'NO_TAKER') { // 没有司机
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS()))
          //   store.dispatch(application.showMessage('没有司机接单，请稍后再试试'))
          // } else if (_status === 'COMPLETED') { // 完成订单
          //   store.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_ON_RATING()))
          // }
        }
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
    ShareUtil.setPlatformConfig(SHARE_MEDIA.SINA_WEIBO, '3853690678', '8c509b8ac029138d30e07e74d8a174b7', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.WECHAT_SESSION, 'wx9e68b689aeabeee8', '65f8dc079438edcdcddca5b938823084', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.WECHAT_CIRCLE, 'wx9e68b689aeabeee8', '65f8dc079438edcdcddca5b938823084', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.TENCENT_QQ, '1106730946', 'cpXqcASFJs2r6vH3', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.TENCENT_QQ_ZONE, '1106730946', 'cpXqcASFJs2r6vH3', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.FACEBOOK, '1728454220518965', '2d53c4fce565096b2c08845ffaf08a00', '')
    ShareUtil.setPlatformConfig(SHARE_MEDIA.TWITTER, '75sUPCwmmjb7R4VP8F7mIly8B', 'gBpNFDJ07FGO5dPQ8zlUFyzrr3KWd82RE6HWVQzyNfiXNbRyCX', '')
  }

  initializationBackHandler() {
    if (Define.system.android) {
      BackHandler.addEventListener('hardwareBackPress', () => store.dispatch(application.onPressAndroidBackButton()))
    }
  }

  initializationMomentConfig() {
    // moment.defineLocale('CUSTOM_TIME_LOCALE', {
    //   relativeTime: {
    //     future: '%s后',
    //     past: '%s前',
    //     s: '%d秒',
    //     m: '1分钟',
    //     mm: '%d分钟',
    //     h: '1小时',
    //     hh: '%d小时',
    //     d: '1天',
    //     dd: '%d天',
    //     M: '1个月',
    //     MM: '%d个月',
    //     y: '1年',
    //     yy: '%d年'
    //   }
    // })
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
    const LOADING_VIEW = (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    )

    return (
      <Provider store={this.state.store}>
        <PersistGate loading={LOADING_VIEW} persistor={store.persist}>          
          <Launch />
        </PersistGate>
      </Provider>
    )
  }
}

export default Core