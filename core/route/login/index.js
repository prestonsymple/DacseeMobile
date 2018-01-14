import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, 
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { Screen, Icons, Redux, Define } from '../../utils'
import { ActApplication } from '../../redux/actions'

export default Redux.connectAndBindAction(state => ({}), ActApplication)
(class LoginScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null   
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      activeFullScreen: false,
      fullScreenStage: new Animated.Value(0)
    }
  }

  async componentDidMount() {
  }

  componentWillUnmount() {
  }

  async _activeFullScreen() {
    await new Promise(resolve => {
      this.state.fullScreenStage.setValue(0)
      this.setState({ activeFullScreen: true })
      Animated.timing(this.state.fullScreenStage, { toValue: 1, duration: 500 }).start(() => resolve())
    })
    
  }

  async _quitFullScreen() {
    await new Promise(resolve => 
      Animated.timing(this.state.fullScreenStage, { toValue: 0, duration: 200 }).start(() => resolve())
    )
    this.setState({ activeFullScreen: false })
  }

  // TODO: Optimize Style
  render() {
    const { fullScreenStage, activeFullScreen } = this.state

    return (
      <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
        {/**/}
        <View style={{ flex: 1 }}>
          {/* TODO: ADD RESOURCES FILE */}
          <Image resizeMode={'cover'} style={{ width: Screen.Window.Width, height: Screen.Window.Height }} source={require('../../resources/images/bg.jpg')} />
        </View>

        {/**/}
        <Animated.View style={[
          { backgroundColor: 'white', height: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: [255, Screen.Window.Height] }) },
          // { backgroundColor: 'white', height: 255 },
          { shadowOffset: { width: 0, height: -3 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
        ]}>
          <Animated.View style={{ flex: 1, marginHorizontal: 20, marginTop: fullScreenStage.interpolate({ inputRange: [0, 0.4, 1], outputRange: [25, 25, 120] }) }}>
            <Animated.View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: fullScreenStage.interpolate({ inputRange: [0, 0.4, 1], outputRange: [30, 30, 80] }) }}>
              <Text style={{ color: '#333', fontSize: 20, fontWeight: '600' }}>登入您的账号</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ color: '#666', fontSize: 13, fontWeight: '600' }}>手机</Text>
                <Text style={{ color: '#aaa', fontSize: 13, fontWeight: '600' }}>/</Text>
                <Text style={{ color: '#aaa', fontSize: 13, fontWeight: '600' }}>邮箱</Text>
              </View>
            </Animated.View>
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
              <TextInput 
                {...Define.TextInputArgs}
                defaultValue={'+86'} 
                style={[
                  { color: '#333', fontWeight: '600', textAlign: 'center', flex: 2, fontSize: 14, height: 36, marginRight: 15 },
                  { borderColor: '#e6e6e6', borderBottomWidth: 1 }
                ]} />
              <TextInput
                {...Define.TextInputArgs}
                placeholder={'输入您的手机号码'}
                style={[
                  { color: '#333', fontWeight: '600', textAlign: 'left', flex: 7, fontSize: 14, height: 36 },
                  { borderColor: '#e6e6e6', borderBottomWidth: 1 }
                ]} />
                {
                  activeFullScreen ? 
                  (null) : 
                  (<TouchableOpacity 
                    onPress={() => this._activeFullScreen()}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
                  />)
                }
            </View>
            <TouchableOpacity onPress={() => this._quitFullScreen()} activeOpacity={0.7} style={{ marginBottom: 25, height: 36, justifyContent: 'center', alignItems: 'center', borderColor: '#e6e6e6', borderWidth: 1, borderRadius: 18 }}>
              <Text style={{ fontSize: 14, color: '#666', fontWeight: '600' }}>登入</Text>
            </TouchableOpacity>
            <View style={{ marginHorizontal: 20 }}>
              {/* <Text style={{ textAlign:'center', fontWeight: '400', color: '#999', fontSize: 12 }}>或</Text> */}
              <Text style={{ textAlign:'center', fontWeight: '400', color: '#5d84af', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4 }}>使用第三方登入</Text>
            </View>
          </Animated.View>
          {/* <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#666' }}>手机 邮箱 社交账号</Text>
          </View> */}
          {/* TODO: Fix Android Style */}
          
        </Animated.View>
      </ScrollView>
    )
  }
})