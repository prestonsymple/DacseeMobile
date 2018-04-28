import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, ListView, StyleSheet
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import { RNCamera } from 'react-native-camera'
import { Icons, Session, System, TextFont, Screen, Define } from '../../../utils'

const { width, height } = Screen.window

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class CommonScanQRCode extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
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

  constructor(props){
    super(props)
    this.state = {
      qrData: {}
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RNCamera
          BarCodeType={RNCamera.Constants.BarCodeType.qr}
          style={{ flex: 1 }}
          ref={cam => this.camera = cam}
          permissionDialogTitle={this.props.i18n.refuse_visit_camera}
          permissionDialogMessage={this.props.i18n.pls_allow_camera_try}
          onBarCodeRead={(code) => {
            if (code.data){
              this.props.navigation.replace('FriendsRequest', { referrer: code.data, i18n:this.props.i18n })
            }
          }}  >
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
