import { Platform } from 'react-native'
import { fork, all, take, call, put, takeEvery, takeLatest, apply } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import Other from './other'
import Country_CN from './cn'

const middlewareHandle = (region) => {
  region.filter()
}

const GetGPS = () => {

}

// 确认国家信息
export default function* MainSaga() {

  // 获取GPS位置
  yield call(GetGPS)

  // 触发器, 每当GPS服务权限发生变更时，触发功能开关

  // 根据GPS位置获取特定逻辑包

  // 过滤器, 每当位置发生大幅度改变时，重新进行区域判定 >= 50km

  // 如果国家信息发生变更，重置Reducer数据，并刷新Saga逻辑层

  // 动态注入视图依赖包

  const sagaPipe = [
    Country_CN,
    Other
  ]

  yield fork(middlewareHandle, sagaPipe)

}




/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

// function* watchClientVersion(action) {
//   try {
//     const { payload } = action
//     console.log(payload)
//     if (payload !== 'inactive') return

//     console.log('[检查更新]')
//     const remoteBundle = yield call(CodePush.checkForUpdate)
//     console.log('[BUNDLE]', remoteBundle)
//     if (!remoteBundle) return
    
//     yield delay(1000)

//     yield put(application.startUpdate(remoteBundle))
//   } catch (e) {
//     console.log(e)
//   }
// }

// function* watchiOSDrawerEvent() {
//   while(true) {
//     yield take(application.openDrawer().type)
//     // yield put(application.hideStatusBar())
//     // yield put(application.showStatusBar())
//     yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
//   }
// }

// function* watchAndroidDrawerEvent() {
//   while(true) {
//     yield take(application.openDrawer().type)
//     yield put(NavigationActions.navigate({ routeName: 'DrawerOpen' }))
//   }
// }

// function* watchNetworkStatus() {
//   while (true) {
//     const status = yield take(application.changeNetworkStatus().type)
//     console.log(status)
//   }
// }

function* watchShowMessage() {
  while (true) {
    const { payload } = yield take(application.showMessage().type)
    const title = typeof(payload) === 'object' ? payload.title : payload
    const options = typeof(payload) === 'object' ? payload.options : {}
    Toast.show(title, Object.assign({}, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
    }, options))
  }
}

// export default function* sagaService() {
//   yield all([
//     // takeLatest(application.changeApplicationStatus().type, watchClientVersion),
//     // fork(Platform.select({ ios: watchiOSDrawerEvent, android: watchAndroidDrawerEvent })),
//     fork(restoreSaga),
//     fork(watchShowMessage),
//
//     fork(passengerSaga),
//     fork(driverSaga),
//
//     fork(loginSaga),
//     fork(circleSaga),
//
//     fork(networkSaga)
//   ])
// }