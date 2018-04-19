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

import { NavigationActions } from 'react-navigation'


const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'FriendsRequest' })],
})

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class CommonScanQRCode extends Component {

  static navigationOptions = ({ navigation }) => {
    // const i18n = global.store.getState().intl.messages
    return {
      drawerLockMode: 'locked-closed',
      // title: this.props.i18n.scan,
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

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    // const data = await Camera.capture()
    // console.log(data)

    console.log(this.props.navigation)

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    console.log(this.state.qrData)
    // if (code.data){
    //   this.props.navigation.navigate({ routeName: 'FriendsRequest', params: { referrer: code.data, i18n:this.props.i18n } })
    // }
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
            console.log(code)

            // this.props.navigation.navigate({ routeName: 'FriendsRequest', params: { referrer: code.data, i18n:this.props.i18n } })

            if (code.data){
              this.props.navigation.replace('FriendsRequest', { referrer: code.data, i18n:this.props.i18n })
              // this.props.navigation.dispatch(
              //   NavigationActions.replace(
              //     'FriendsRequest'
              //     // actions: [NavigationActions.navigate({ routeName: 'FriendsRequest', params: { referrer: code.data, i18n:this.props.i18n } })],
              //   ))
            }

            // this.setState({
            //   qrData: code
            // })

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
