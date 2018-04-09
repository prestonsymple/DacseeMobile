import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, ListView, TextInput, Image, RefreshControl, ActivityIndicator, StyleSheet
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'

import { application } from '../../../redux/actions'
import { Icons, Session, System, TextFont, Screen, Define } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class CommonScanQRCode extends Component {

  static navigationOptions = ({ navigation }) => {
    // const i18n = global.store.getState().intl.messages
    return {
      drawerLockMode: 'locked-closed',
      title: '扫一扫',
      headerStyle: {
        backgroundColor: '#141518',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      }
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    // const data = await Camera.capture()
    // console.log(data)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          BarCodeType={RNCamera.Constants.BarCodeType.qr}
          style={{ flex: 1 }}
          ref={cam => this.camera = cam}
          permissionDialogTitle={'无法访问相机'}
          permissionDialogMessage={'请打开相机访问权限后重试'}
          onBarCodeRead={(code) => {
            console.log(code)
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ top: Define.system.ios.x ? -44 : -22, width: width * .6, height: width * .6 }}>
              <View style={[styles.codeBorder, { top: 0, left: 0, height: 1.2, width: width * .2 }]} />
              <View style={[styles.codeBorder, { top: 0, left: 0, height: width * .2, width: 1.2 }]} />

              <View style={[styles.codeBorder, { bottom: 0, left: 0, height: width * .2, width: 1.2 }]} />
              <View style={[styles.codeBorder, { bottom: 0, left: 0, height: 1.2, width: width * .2 }]} />

              <View style={[styles.codeBorder, { bottom: 0, right: 0, height: width * .2, width: 1.2 }]} />
              <View style={[styles.codeBorder, { bottom: 0, right: 0, height: 1.2, width: width * .2 }]} />

              <View style={[styles.codeBorder, { top: 0, right: 0, height: width * .2, width: 1.2 }]} />
              <View style={[styles.codeBorder, { top: 0, right: 0, height: 1.2, width: width * .2 }]} />
            </View>
          </View>
          <View style={{ position: 'absolute', bottom: 48, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: '#ffffffcc', height: 44, width: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22 }}>
              { Icons.Generator.Material('lightbulb-outline', 28, '#666') }
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    )
  }
})


const styles = StyleSheet.create({
  codeBorder: { backgroundColor: '#ffffffcc', position: 'absolute' }
})