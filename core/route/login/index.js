import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, 
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView, Easing, I18nManager } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'

import { Screen, Icons, Redux, Define } from '../../utils'
import { ActApplication } from '../../redux/actions'

const FirstRoute = () => <View style={[ { flex: 1 }, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ { flex: 1 }, { backgroundColor: '#673ab7' } ]} />;

export default Redux.connectAndBindAction(state => ({}), ActApplication)
(class LoginScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null   
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      routes: [
        { key: 'phone', icon: 'ios-call' },
        { key: 'mail', icon: 'md-mail' },
        { key: 'social', icon: 'ios-medical' }
      ],
      enterFullScreen: false,
      fullScreenStage: new Animated.Value(0)
    }
  }

  async componentDidMount() {
  }

  componentWillUnmount() {
  }

  async _enterFullScreen() {
    await new Promise(resolve => {
      this.setState({ activeFullScreen: true })
      Animated.timing(this.state.fullScreenStage, { 
        toValue: 1, 
        duration: 400,
        easing: Easing.linear
      }).start(() => resolve())
    })
  }

  async _quitFullScreen() {
    await new Promise(resolve => 
      Animated.timing(this.state.fullScreenStage, { 
        toValue: 0, 
        duration: 400,
        easing: Easing.linear
      }).start(() => resolve())
    )
    this.setState({ activeFullScreen: false })
  }
  
  phoneAccount = () => {
    const { fullScreenStage, activeFullScreen } = this.state
    return (
    <Animated.View style={[
      { backgroundColor: '#fefefe', height: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: [255, Screen.Window.Height] }) },
      // { backgroundColor: 'white', height: 255 },
      { shadowOffset: { width: 0, height: -3 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
    ]}>
      <Animated.View style={{ flex: 1, marginHorizontal: 20, marginTop: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: [25, 120] }) }}>
        <Animated.View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: [30, 80] }) }}>
          <Text style={{ color: '#333', fontSize: 20, fontWeight: '600' }}>登入您的账号</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ color: '#666', fontSize: 13, fontWeight: '600' }}>手机</Text>
            <Text style={{ color: '#aaa', fontSize: 13, fontWeight: '600' }}>/</Text>
            <Text style={{ color: '#aaa', fontSize: 13, fontWeight: '600' }}>邮箱</Text>
          </View>
        </Animated.View>
        <Animated.View style={{ flexDirection: 'row', marginBottom: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: [30, 50] }) }}>
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
                onPress={() => this._enterFullScreen()}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
              />)
            }
        </Animated.View>
        <TouchableOpacity onPress={() => this._quitFullScreen()} activeOpacity={0.7} style={{ marginBottom: 25, height: 36, justifyContent: 'center', alignItems: 'center', borderColor: '#e6e6e6', borderWidth: 1, borderRadius: 18 }}>
          <Text style={{ fontSize: 14, color: '#666', fontWeight: '600' }}>登入</Text>
        </TouchableOpacity>
        <View style={{ marginHorizontal: 20 }}>
          {/* <Text style={{ textAlign:'center', fontWeight: '400', color: '#999', fontSize: 12 }}>或</Text> */}
          <Animated.Text style={{ textAlign:'center', fontWeight: '400', color: fullScreenStage.interpolate({ inputRange: [0, 1], outputRange: ['#5d84af', '#fefefe'] }), fontSize: 12, paddingHorizontal: 10, paddingVertical: 4 }}>使用第三方登入</Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
    )
  }

  // _renderIndicator(props) {
  //   const { width, position, navigationState } = props;
  //   const translateX = Animated.multiply(
  //     Animated.multiply(
  //       position.interpolate({
  //         inputRange: [0, navigationState.routes.length - 1],
  //         outputRange: [0, navigationState.routes.length - 1],
  //         extrapolate: 'clamp',
  //       }),
  //       width
  //     ),
  //     I18nManager.isRTL ? -1 : 1
  //   );
  //   return (
  //     <Animated.View
  //       style={[
  //         {
  //           backgroundColor: '#ffa81d',
  //           position: 'absolute',
  //           left: 0,
  //           top: 0,
  //           right: 0,
  //           height: 2,
  //         },
  //         { width, transform: [{ translateX }] },
  //         props.indicatorStyle,
  //       ]}
  //     />
  //   )
  // }


  // TODO: Optimize Style
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/**/}
        <View style={{ flex: 1 }}>
          {/* TODO: ADD RESOURCES FILE */}
          <Image resizeMode={'cover'} style={{ width: Screen.Window.Width, height: Screen.Window.Height }} source={require('../../resources/images/bg.jpg')} />
        </View>

        <TabViewAnimated
          style={{ flex: 1, position: 'absolute', bottom: 0 }}
          navigationState={this.state}
          renderScene={SceneMap({
            phone: this.phoneAccount.bind(this),
            mail: this.phoneAccount.bind(this),
            social: this.phoneAccount.bind(this)
          })}
          renderFooter={(props) => <TabBar
            {...props}
            // renderIndicator={this._renderIndicator}
            indicatorStyle={{ backgroundColor: '#ffa81d', top: 0, bottom: undefined }}
            renderIcon={({ route }) => Icons.Generator.Ion(route.icon, 24, 'white')}
            style={{ backgroundColor: '#222' }}
          />}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ height: 0, width: Screen.Window.Width }}
        />
      </View>
    )
  }
})