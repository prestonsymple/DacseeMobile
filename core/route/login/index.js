import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, 
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView, Easing, I18nManager, TouchableNativeFeedback, Platform, Keyboard } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions, SafeAreaView } from 'react-navigation'
import Toast from 'react-native-root-toast'

import { Screen, Icons, Redux, Define } from '../../utils'
import resources from '../../resources'
import { Button } from '../../components'
import { application, account } from '../../redux/actions'
import { connect } from 'react-redux'

const codeInputWidth = ((Screen.window.width - 40 * 2) - 35 * 3) / 4
const codeInputProps = {
  maxLength: 1,
  returnKeyType: 'next',
  placeholderTextColor: '#eee',
  keyboardType: 'numeric',
  clearTextOnFocus: false
}


export default connect(state => ({ account: state.account }))(class LoginScreen extends Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      v1: '', v2: '', v3: '', v4: ''
    }
    this.codeInput = {}
    this.animated = {}
    this.animated.stage = new Animated.Value(0)
    this.animated.enterRegister = new Animated.Value(0)
    this.animated.isMail = new Animated.Value(1)
  }

  async componentDidMount() {}
  componentWillUnmount() {}

  componentWillReceiveProps(props) {
    const { account } = this.props
    const { stage } = props.account
    const valid = stage !== account.stage
    if (!valid) return

    const STAGE_VALUE_MAP = [0, 2, 3, 4]
    const STAGE_DURATION_MAP = [500, 200, 200, 200]
    const STAGE_MIN_MAX_VALUE = stage > account.stage ? { max: stage, min: account.stage } : { max: account.stage, min: stage }
    const duration = STAGE_DURATION_MAP
      .filter((_, index) => (index >= STAGE_MIN_MAX_VALUE.min && index < STAGE_MIN_MAX_VALUE.max))
      .reduce((p, n) => p + n)
    Animated.timing(this.animated.stage, { toValue: STAGE_VALUE_MAP[stage], duration, easing: Easing.linear })
  }

  async vaildAccount(v4) {
    this.setState({ v4 })
    if (v4.length === 0) return this.codeInput.v3.focus()
    const { v1, v2, v3 } = this.state
    const vCode = `${v1}${v2}${v3}${v4}`
    Keyboard.dismiss()
    this.props.dispatch(account.accountVerificationCodeInputCompletion(vCode))
  }

  stageHandle() {
    const { stage } = this.props
    const { value } = this.state

    if (stage === 0) return this.props.dispatch(account.loginNext())
    // if (stage === 1) {
    //   if (!value.length) return Toast.show('请输入正确的邮箱或手机号', {
    //     duration: Toast.durations.LONG,
    //     position: Toast.positions.CENTER,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //   })
      
    //   const isMail = this.isEmail(value)
    //   const body = isMail ? { email: value } : { phoneCountryCode: '+86', phoneNo: value }
    //   this.props.dispatch(account.accountSendVerificationCode({ isMail, body }))
    //   this.goStage2()
    //   this.codeInput.v1.focus()
    // }
    // if (stage === 2) {
    //   Keyboard.dismiss()
    //   this.backStage1()
    //   this.codeInput.v1.clear()
    //   this.codeInput.v2.clear()
    //   this.codeInput.v3.clear()
    //   this.codeInput.v4.clear()
    // }
  }

  backgroundHandle() {
    Keyboard.dismiss()
    if (this.state.stage === 2) return
    this.backStage0()
  }

  isEmail(val) { 
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return reg.test(val)
  }

  // TODO: Optimize Style
  render() {
    const { width, height } = Screen.window
    const { enterLogin, enterRegister, isMail } = this.animated
    const { stage } = this.state
    const bottomBtnHeight = Define.system.ios.x ? 66 : 44

    return (
      <View style={{ flex: 1 }}>
        {/**/}
        <Image resizeMode={'cover'} style={{ width, height }} source={resources.image.login_bg} />
        <Animated.View style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          { backgroundColor: enterLogin.interpolate({ inputRange: [0, 0.6, 3, 4], outputRange: ['#33333300', '#33333373', '#33333373', '#000000cc'] }) }
        ]} />
        <Animated.View style={[
          { flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          { opacity: enterRegister.interpolate({ inputRange: [0, .95], outputRange: [1, 0] }) }
        ]}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={this.backgroundHandle.bind(this)} activeOpacity={1}>
            <Animated.Image style={[
              { height: 80, width: 80, resizeMode: 'contain', position: 'absolute' },
              { top: enterLogin.interpolate({ inputRange: [0, .8, 1, 2], outputRange: [80, 80, 110, 110], extrapolate: 'clamp' }) },
              { left: enterLogin.interpolate({ inputRange: [0, .5, .9, 1, 2], outputRange: [35, 35, -150, width, (width / 2) - 40], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, .8, 1, 1.3, 2], outputRange: [1, 0, 0, 0, 1], extrapolate: 'clamp' }) }
            ]} source={resources.image.logo}></Animated.Image>
            <Animated.Text style={[
              { position: 'absolute', top: 170 },
              { fontSize: 35, lineHeight: 40, fontWeight: '400', color: 'white' },
              { left: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [35, -200, -200], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, .6, 2], outputRange: [1, 0, 0], extrapolate: 'clamp' }) }
            ]}>Welcome to</Animated.Text>
            <Animated.Text style={[
              { fontSize: 35, top: 205, lineHeight: 40, fontWeight: '400', color: 'white', position: 'absolute' },
              { left: enterLogin.interpolate({ inputRange: [0, .5, .9, 1.4, 2], outputRange: [35, 35, -150, width, (width / 2) - 62], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, .8, 1, 1.3, 2], outputRange: [1, 0, 0, 0, 1], extrapolate: 'clamp' }) }
            ]}>DACSEE</Animated.Text>

            <Animated.View style={[
              { position: 'absolute', top: (height / 2) - 60 },
              { justifyContent: 'center' },
              { left: enterLogin.interpolate({ inputRange: [0, 1.2, 2, 3], outputRange: [-width, 0, 0, -width], extrapolate: 'clamp' }) },
              { right: enterLogin.interpolate({ inputRange: [0, .01, 2, 3], outputRange: [width, 0, 0, width], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, 0.8, 2, 2.4, 3], outputRange: [0, 0, 1, 0, 0], extrapolate: 'clamp' }) }
            ]}>
              <View style={{ flexDirection: 'row', marginHorizontal: 45 }}>
                <Animated.View style={[
                  { overflow: 'hidden' },
                  { opacity: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0, 0], extrapolate: 'clamp' }) },
                  { width: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [65, 65, 0], extrapolate: 'clamp' }) },
                  { marginRight: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [15, 15, 0], extrapolate: 'clamp' }) }
                ]}>
                  <Button activeOpacity={0.9} style={[ { borderColor: '#f2f2f2', borderBottomWidth: 1, flex: 1, height: 44, justifyContent: 'center' } ]}>
                    <Text style={styles.stdInput}>+86</Text>
                  </Button>
                </Animated.View>
                <TextInput
                  {...Define.TextInputArgs}
                  clearTextOnFocus={false}
                  placeholderTextColor={'#eee'}
                  placeholder={'Phone Number / Email'}
                  returnKeyType={'done'}
                  onChangeText={text => {
                    this.setState({ value: text })
                    if (this.isEmail(text)) return Animated.timing(this.animated.isMail, { toValue: 1, duration: 250, easing: Easing.linear}).start()
                    Animated.timing(this.animated.isMail, { toValue: 0, duration: 250, easing: Easing.linear}).start()
                  }}
                  style={[ styles.stdInput, { flex: 7, borderColor: '#f2f2f2', borderBottomWidth: 1, height: 44 } ]} />
              </View>
            </Animated.View>

            <Animated.View style={[
              { position: 'absolute', right: 0, top: (height / 2) - 60 },
              { justifyContent: 'center' },
              { left: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [width, width, 0], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }
            ]}>
              <View style={{ flexDirection: 'row', marginHorizontal: 45, justifyContent: 'space-between' }}>
                <TextInput ref={e => this.codeInput.v1 = e} style={styles.codeInput} {...Define.TextInputArgs} {...codeInputProps} 
                  onChangeText={text => {
                    this.setState({ v1: text })
                    if (text.length === 1) return this.codeInput.v2.focus()
                  }} />
                <TextInput ref={e => this.codeInput.v2 = e} style={styles.codeInput} {...Define.TextInputArgs} {...codeInputProps} 
                  onChangeText={text => {
                    this.setState({ v2: text })
                    if (text.length === 0) return this.codeInput.v1.focus()
                    this.codeInput.v3.focus()
                  }} />
                <TextInput ref={e => this.codeInput.v3 = e} style={styles.codeInput} {...Define.TextInputArgs} {...codeInputProps} 
                  onChangeText={text => {
                    this.setState({ v3: text })
                    if (text.length === 0) return this.codeInput.v2.focus()
                    this.codeInput.v4.focus()
                  }} />
                <TextInput ref={e => this.codeInput.v4 = e} style={styles.codeInput} {...Define.TextInputArgs} {...codeInputProps} 
                  onChangeText={text => this.vaildAccount(text)} />
              </View>
            </Animated.View>

            <Animated.View style={[
              { position: 'absolute', overflow: 'hidden' },
              { height: enterLogin.interpolate({ inputRange: [0, 1], outputRange: [bottomBtnHeight, 44], extrapolate: 'clamp' }) },
              { top: Platform.select({
                ios: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [height - bottomBtnHeight, (height / 2) + 24, (height / 2) + 24]}),
                android: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [height - bottomBtnHeight - 22, (height / 2) + 24, (height / 2) + 24]}),
              })},
              { right: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35]}) },
              { left: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35]}) },
              { borderRadius: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 22, 22]}) },
            ]}>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={.9} onPress={this.stageHandle.bind(this)}>
                <Animated.View style={[
                  { flex: 1, alignItems: 'center', flexDirection: 'row' },
                  { backgroundColor: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: ['#ffa81d', '#ffa81d', '#ffa81d'], extrapolate: 'clamp' }) },
                  { width: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [width * 3, (width - 70) * 3, (width - 70) * 3], extrapolate: 'clamp' }), }
                ]}>
                  <Animated.Text style={[
                    { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: 'white' },
                    { opacity: enterLogin.interpolate({ inputRange: [0, 1.4, 1.8, 2], outputRange: [1, 1, 0, 0], extrapolate: 'clamp' }) },
                    { left: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 0, -(width - 70)], extrapolate: 'clamp' }) }
                  ]}>LOGIN</Animated.Text>
                  <Animated.View style={[
                    { flex: 1, alignItems: 'center' },
                    { opacity: enterLogin.interpolate({ inputRange: [0, 1.5, 1.9, 2, 2.4], outputRange: [0, 0, 1, 1, 0], extrapolate: 'clamp' }) },
                    { left: enterLogin.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [0, 0, -(width - 70), -((width - 70) * 2)], extrapolate: 'clamp' }) }
                  ]}>
                    { Icons.Generator.Material('arrow-forward', 28, 'white') }
                  </Animated.View>
                  <Animated.View style={[
                    { flex: 1, alignItems: 'center' },
                    { opacity: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, 1], extrapolate: 'clamp' }) },
                    { left: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, -((width - 70) * 2)], extrapolate: 'clamp' }) }
                  ]}>
                    { Icons.Generator.Material('arrow-back', 28, 'white') }
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
              { position: 'absolute', right: 0, top: (height / 2) + 120 },
              { justifyContent: 'center', alignItems: 'center' },
              { left: enterLogin.interpolate({ inputRange: [0, 1.2, 2], outputRange: [-width, 0, 0], extrapolate: 'clamp' }) },
              { opacity: enterLogin.interpolate({ inputRange: [0, 0.8, 2], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }
            ]}>
              <Text style={{ flex: 1, color: '#d2d2d2', textAlign: 'center' }}>Or connect using a social account</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 150, marginTop: 25 }}>
                <Button style={styles.socialBtn}>
                  { Icons.Generator.Awesome('google-plus', 24, '#333') }
                </Button>
                <Button style={styles.socialBtn}>
                  { Icons.Generator.Awesome('facebook', 24, '#333') }
                </Button>
                <Button style={styles.socialBtn}>
                  { Icons.Generator.Awesome('twitter', 24, '#333') }
                </Button>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  codeInput: {
    color: '#fff', 
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    height: 44,
    width: codeInputWidth,
    borderColor: '#f2f2f2',
    borderBottomWidth: 1
  },
  socialBtn: { 
    backgroundColor: '#eaeaea',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  stdInput: { 
    color: '#fff', 
    fontWeight: '600', 
    textAlign: 'center', 
    fontSize: 16
  },
})