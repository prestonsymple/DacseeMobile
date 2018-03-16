import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, Image,
  TouchableOpacity, TextInput, Easing, Platform, Keyboard, StatusBar,
  ScrollView
} from 'react-native'
// import InteractionManager from 'InteractionManager'
// import { NavigationActions, SafeAreaView } from 'react-navigation'
import marked from 'marked'

import { Screen, Icons, Define, Session } from '../../utils'
import resources from '../../resources'
import { Button } from '../../components'
import ShareUtile from '../../native/umeng/ShareUtil'
import actionApplication, { application as app, account } from '../../redux/actions'
import { connect } from 'react-redux'

const codeInputWidth = ((Screen.window.width - 40 * 2) - 35 * 3) / 4
const codeInputProps = {
  maxLength: 1,
  returnKeyType: 'next',
  placeholderTextColor: '#eee',
  keyboardType: 'numeric',
  clearTextOnFocus: false
}


export default connect(state => ({
  account: state.account,
  referrer_id: state.application.referrerValue,
  full_name: state.application.full_name,
  stage: state.application.login_stage
}))(class LoginScreen extends Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props)
    this.state = {
      value: '', // mail or phone no.
      value_extend: '',
      v1: '', v2: '', v3: '', v4: '',
      verify_code_extend: '',
      referralUserId: props.referrer_id || '',
      fullName: '',
      countryCode: '+86',
      selectAccount: []
    }
    this.codeInput = {}
    this.animated = {}
    this.animated.stage = new Animated.Value(0)
    this.animated.enterRegister = new Animated.Value(0)
    this.animated.isMail = new Animated.Value(1)
  }

  async componentDidMount() { }
  componentWillUnmount() { }

  componentWillReceiveProps(props) {
    if (this.props.account.status !== props.account.status) {
      this.props.navigation.navigate(props.account.status && 'App')
    }

    const { stage } = props
    const valid = stage !== this.props.stage
    if (!valid) return

    const STAGE_VALUE_MAP = [0, 2, 3, 4, 5]
    const STAGE_DURATION_MAP = [500, 200, 200, 200, 200]
    const STAGE_MIN_MAX_VALUE = stage > this.props.stage ? { max: stage, min: this.props.stage } : { max: this.props.stage, min: stage }
    const duration = STAGE_DURATION_MAP
      .filter((_, index) => (index >= STAGE_MIN_MAX_VALUE.min && index < STAGE_MIN_MAX_VALUE.max))
      .reduce((p, n) => p + n)
    this.animated.stage.stopAnimation()
    Animated.timing(this.animated.stage, { toValue: STAGE_VALUE_MAP[stage], duration, easing: Easing.linear }).start()

    if (stage === 2) { 
      this.codeInput.v1.clear() || this.codeInput.v2.clear() || this.codeInput.v3.clear() || this.codeInput.v4.clear()
      this.codeInput.v1.focus() 
    }
  }

  async validAccount(v4) {
    this.setState({ v4 })
    if (v4.length === 0) return this.codeInput.v3.focus()
    const { v1, v2, v3, value, countryCode } = this.state
    const vCode = `${v1}${v2}${v3}${v4}`
    Keyboard.dismiss()
    this.props.dispatch(account.loginNext({
      stage: 3, value: {
        phoneCountryCode: countryCode,
        id: value,
        code: vCode,
        isMail: this.isEmail(value)
      }
    }))
  }

  stageHandle() {
    const { stage } = this.props
    const { value, countryCode } = this.state

    this.codeInput.v1.clear() || this.codeInput.v2.clear() || this.codeInput.v3.clear() || this.codeInput.v4.clear()

    if
    (stage === 0) {
      this.props.dispatch(account.loginNext({ stage: 1 }))
    } else if
    (stage === 1) {
      if (!value.length) return this.props.dispatch(app.showMessage('请输入正确的邮箱或手机号'))
      const isMail = this.isEmail(value)
      const body = isMail ? { id: value, isMail: true } : { phoneCountryCode: countryCode, phoneNo: value }
      this.props.dispatch(account.loginNext({ stage: isMail ? 3 : 2, value: body }))
    } else if
    (stage === 2) {
      this.props.dispatch(account.loginBack(1))
      Keyboard.dismiss()
    }
  }

  onPressComplate() {
    const { value, countryCode, fullName, referralUserId, v1, v2 ,v3, v4, value_extend, verify_code_extend } = this.state
    if (fullName.length < 2) {
      return this.props.dispatch(app.showMessage('全名最小为2个字符'))
    }
    const vCode = `${v1}${v2}${v3}${v4}`
    const data = {
      fullName: fullName,
      phoneCountryCode: countryCode,
      phoneNo: value,
      phoneVerificationCode: vCode,
      referralUserId: referralUserId,
    }

    if (value_extend && verify_code_extend) {
      data.phoneNo = value_extend
      data.phoneVerificationCode = verify_code_extend
      data.email = value
    }

    this.props.dispatch(account.loginNext({ stage: 5, value: data }))
  }

  renderHtml(html) {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charset="utf-8" />
          <style>
            h3, h4 { font-weight: 400 }
            h3 { font-size: 16px; color: '#333' }
            h4 { font-size: 14px; color: '#666' }
            p { font-size: 13px; color: '#666' }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `
  }

  backgroundHandle() {
    Keyboard.dismiss()
    if (this.props.stage === 1 && this.state.value.length === 0) return this.props.dispatch(account.loginBack(0))
  }

  isEmail(val) {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return reg.test(val)
  }

  // _googlePlus() {
  //   ShareUtile.auth(0,(code,result,message) =>{
  //     this.setState({result:message})
  //     if (code == 0){
  //       this.setState({result:result.uid})
  //     }
  //   })
  // }

  // TODO: Optimize Style
  render() {
    const { width, height } = Screen.window
    const { stage, isMail } = this.animated
    const bottomBtnHeight = Define.system.ios.x ? 66 : 44

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'black'} barStyle={'light-content'} />
        {/**/}
        <Image resizeMode={'cover'} style={{ width, height }} source={resources.image.login_bg} />
        <Animated.View style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          { backgroundColor: stage.interpolate({ inputRange: [0, 0.6, 3, 4, 5], outputRange: ['#33333300', '#33333373', '#33333373', '#000000cc', '#000000cc'] }) }
        ]} />
        <Animated.View style={[
          { flex: 1, position: 'absolute', top: 0, bottom: 0 },
          { left: stage.interpolate({ inputRange: [0, 3.95, 3.99], outputRange: [0, 0, -width], extrapolate: 'clamp' }) },
          { right: stage.interpolate({ inputRange: [0, 3.95, 3.99], outputRange: [0, 0, width], extrapolate: 'clamp' }) },
          { opacity: stage.interpolate({ inputRange: [0, 3, 3.95], outputRange: [1, 1, 0], extrapolate: 'clamp' }) }
        ]}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={this.backgroundHandle.bind(this)} activeOpacity={1}>
            <Animated.Image style={[
              { height: 80, width: 80, resizeMode: 'contain', position: 'absolute' },
              { top: stage.interpolate({ inputRange: [0, .8, 1, 2], outputRange: [80, 80, 110, 110], extrapolate: 'clamp' }) },
              { left: stage.interpolate({ inputRange: [0, .5, .9, 1, 2], outputRange: [35, 35, -150, width, (width / 2) - 40], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, .8, 1, 1.3, 2], outputRange: [1, 0, 0, 0, 1], extrapolate: 'clamp' }) }
            ]} source={resources.image.logo}></Animated.Image>
            <Animated.Text style={[
              { position: 'absolute', top: 170 },
              { fontSize: 35, lineHeight: 40, fontWeight: '400', color: 'white' },
              { left: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [35, -200, -200], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, .6, 2], outputRange: [1, 0, 0], extrapolate: 'clamp' }) }
            ]}>欢迎使用</Animated.Text>
            <Animated.Text style={[
              { fontSize: 35, top: 205, lineHeight: 40, fontWeight: '400', color: 'white', position: 'absolute' },
              { left: stage.interpolate({ inputRange: [0, .5, .9, 1.4, 2], outputRange: [35, 35, -150, width, (width / 2) - 62], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, .8, 1, 1.3, 2], outputRange: [1, 0, 0, 0, 1], extrapolate: 'clamp' }) }
            ]}>DACSEE</Animated.Text>

            <Animated.View style={[
              { position: 'absolute', top: (height / 2) - 60 },
              { justifyContent: 'center' },
              { left: stage.interpolate({ inputRange: [0, 1.2, 2, 3], outputRange: [-width, 0, 0, -width], extrapolate: 'clamp' }) },
              { right: stage.interpolate({ inputRange: [0, .01, 2, 3], outputRange: [width, 0, 0, width], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, 0.8, 2, 2.4, 3], outputRange: [0, 0, 1, 0, 0], extrapolate: 'clamp' }) }
            ]}>
              <View style={{ flexDirection: 'row', marginHorizontal: 45 }}>
                <Animated.View style={[
                  { overflow: 'hidden' },
                  { opacity: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0, 0], extrapolate: 'clamp' }) },
                  { width: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [65, 65, 0], extrapolate: 'clamp' }) },
                  { marginRight: isMail.interpolate({ inputRange: [0, 0.6, 1], outputRange: [15, 15, 0], extrapolate: 'clamp' }) }
                ]}>
                  <Button 
                    onPress={() => this.props.navigation.navigate('PickerCountry', {
                      onPress: ({ name, code }) => this.setState({ countryCode: code })
                    })} 
                    activeOpacity={0.9} 
                    style={[{ borderColor: '#f2f2f2', borderBottomWidth: 1, flex: 1, height: 44, justifyContent: 'center' }]}
                  >
                    <Text style={styles.stdInput}>{this.state.countryCode}</Text>
                  </Button>
                </Animated.View>
                <TextInput
                  {...Define.TextInputArgs}
                  clearTextOnFocus={false}
                  placeholderTextColor={'#eee'}
                  placeholder={'电话号码 / 邮箱'}
                  returnKeyType={'done'}
                  onChangeText={text => {
                    this.setState({ value: text })
                    if (this.isEmail(text)) return Animated.timing(this.animated.isMail, { toValue: 1, duration: 250, easing: Easing.linear }).start()
                    Animated.timing(this.animated.isMail, { toValue: 0, duration: 250, easing: Easing.linear }).start()
                  }}
                  style={[styles.stdInput, { flex: 7, borderColor: '#f2f2f2', borderBottomWidth: 1, height: 44 }]} />
              </View>
            </Animated.View>

            <Animated.View style={[
              { position: 'absolute', right: 0, top: (height / 2) - 60 },
              { justifyContent: 'center' },
              { left: stage.interpolate({ inputRange: [0, 2, 3], outputRange: [width, width, 0], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }
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
                  onChangeText={text => this.validAccount(text)} />
              </View>
            </Animated.View>

            <Animated.View style={[
              { position: 'absolute', overflow: 'hidden' },
              { height: stage.interpolate({ inputRange: [0, 1], outputRange: [bottomBtnHeight, 44], extrapolate: 'clamp' }) },
              {
                top: Platform.select({
                  ios: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [height - bottomBtnHeight, (height / 2) + 24, (height / 2) + 24] }),
                  android: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [height - bottomBtnHeight - 22, (height / 2) + 24, (height / 2) + 24] }),
                })
              },
              { right: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35] }) },
              { left: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35] }) },
              { borderRadius: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 22, 22] }) },
            ]}>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={.9} onPress={this.stageHandle.bind(this)}>
                <Animated.View style={[
                  { flex: 1, alignItems: 'center', flexDirection: 'row' },
                  { backgroundColor: stage.interpolate({ inputRange: [0, 1, 2], outputRange: ['#ffa81d', '#ffa81d', '#ffa81d'], extrapolate: 'clamp' }) },
                  { width: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [width * 3, (width - 70) * 3, (width - 70) * 3], extrapolate: 'clamp' }), }
                ]}>
                  <Animated.Text style={[
                    { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: 'white' },
                    { opacity: stage.interpolate({ inputRange: [0, 1.4, 1.8, 2], outputRange: [1, 1, 0, 0], extrapolate: 'clamp' }) },
                    { left: stage.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 0, -(width - 70)], extrapolate: 'clamp' }) }
                  ]}>登录</Animated.Text>
                  <Animated.View style={[
                    { flex: 1, alignItems: 'center' },
                    { opacity: stage.interpolate({ inputRange: [0, 1.5, 1.9, 2, 2.4], outputRange: [0, 0, 1, 1, 0], extrapolate: 'clamp' }) },
                    { left: stage.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [0, 0, -(width - 70), -((width - 70) * 2)], extrapolate: 'clamp' }) }
                  ]}>
                    {Icons.Generator.Material('arrow-forward', 28, 'white')}
                  </Animated.View>
                  <Animated.View style={[
                    { flex: 1, alignItems: 'center' },
                    { opacity: stage.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, 1], extrapolate: 'clamp' }) },
                    { left: stage.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, -((width - 70) * 2)], extrapolate: 'clamp' }) }
                  ]}>
                    {Icons.Generator.Material('arrow-back', 28, 'white')}
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            {/* <Animated.View style={[
              { position: 'absolute', right: 0, top: (height / 2) + 120 },
              { justifyContent: 'center', alignItems: 'center' },
              { left: stage.interpolate({ inputRange: [0, 1.2, 2], outputRange: [-width, 0, 0], extrapolate: 'clamp' }) },
              { opacity: stage.interpolate({ inputRange: [0, 0.8, 2], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }
            ]}>
              <Text style={{ flex: 1, color: '#d2d2d2', textAlign: 'center' }}>使用社交账号进行登录</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 150, marginTop: 25 }}>
                <Button onPress={() => {
                  ShareUtile.auth(0, (code, result, message) =>{
                    this.setState({ result: message })
                    if (code == 0){
                      this.setState({ result: result.uid })
                    } else {
                      console.log('第三方登录' + code)
                    }
                  })
                }} style={styles.socialBtn}>
                  {Icons.Generator.Awesome('google-plus', 24, '#333')}
                </Button>
                <Button onPress={() => this.props.dispatch(app.showMessage('SDK尚未初始化'))} style={styles.socialBtn}>
                  {Icons.Generator.Awesome('facebook', 24, '#333')}
                </Button>
                <Button onPress={() => this.props.dispatch(app.showMessage('SDK尚未初始化'))} style={styles.socialBtn}>
                  {Icons.Generator.Awesome('twitter', 24, '#333')}
                </Button>
              </View>
            </Animated.View> */}
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[
          { flex: 1, backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0 },
          { left: stage.interpolate({ inputRange: [0, 4, 5], outputRange: [width, width, 0], extrapolate: 'clamp' }) },
          { right: stage.interpolate({ inputRange: [0, 4, 5], outputRange: [-width, -width, 0], extrapolate: 'clamp' }) },
          { opacity: stage.interpolate({ inputRange: [0, 4, 5], outputRange: [0, 0, 1], extrapolate: 'clamp' }) }
        ]}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center' }} style={{
            flex: 1, paddingHorizontal: 45, marginTop: this.isEmail(this.state.value) ? 110 : 200
          }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 45 }}>
              <Text style={{ fontSize: 26, color: '#f2f2f2', fontWeight: '400' }}>激活您的账号</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <TextInput
                {...Define.TextInputArgs}
                clearTextOnFocus={false}
                editable={false}
                defaultValue={this.state.value}
                style={[styles.stdInput, styles.registerTextInput]} />
              {
                this.isEmail(this.state.value) && (
                  <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                    <Button 
                      onPress={() => this.props.navigation.navigate('PickerCountry', {
                        onPress: ({ name, code }) => this.setState({ countryCode: code })
                      })} 
                      activeOpacity={0.9} 
                      style={[{ borderColor: '#f2f2f2', marginRight: 15, borderBottomWidth: 1, width: 70, height: 44, justifyContent: 'center' }]}
                    >
                      <Text style={styles.stdInput}>{this.state.countryCode}</Text>
                    </Button>
                    <TextInput
                      {...Define.TextInputArgs}
                      clearTextOnFocus={false}
                      placeholderTextColor={'#999'}
                      placeholder={'请输入手机号'}
                      onChangeText={value_extend => this.setState({ value_extend })}
                      style={[styles.stdInput, {
                        flex: 1,
                        height: 44,
                        borderBottomWidth: 1,
                        borderColor: 'white',
                        textAlign: 'center',
                        color: 'white'
                      }]} />
                  </View>
                )
              }
              {
                this.isEmail(this.state.value) && (
                  <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                    <TextInput
                      {...Define.TextInputArgs}
                      clearTextOnFocus={false}
                      keyboardType={'number-pad'}
                      placeholderTextColor={'#999'}
                      placeholder={'输入验证码'}
                      onChangeText={verify_code_extend => this.setState({ verify_code_extend })}
                      style={[styles.stdInput, {
                        flex: 1,
                        height: 44,
                        borderBottomWidth: 1,
                        borderColor: 'white',
                        textAlign: 'center',
                        color: 'white'
                      }]} 
                    />
                    <Button 
                      onPress={async () => {
                        try {
                          const { verify_code_extend, value_extend } = this.state
                          await Session.user.post('v1/sendVerificationCode/phone', {
                            phoneCountryCode: this.state.countryCode,
                            phoneNo: value_extend
                          })
                          this.props.dispatch(app.showMessage('已将验证码发送至您的手机'))
                        } catch (e) {
                          this.props.dispatch(app.showMessage('发生错误'))
                        }
                      }} 
                      activeOpacity={0.9} 
                      style={[{ marginLeft: 15, backgroundColor: '#ffa81d', borderRadius: 22, width: 120, height: 44, justifyContent: 'center' }]}
                    >
                      <Text style={styles.stdInput}>发送验证码</Text>
                    </Button>
                  </View>
                )
              }
              <TextInput
                {...Define.TextInputArgs}
                clearTextOnFocus={false}
                placeholderTextColor={'#999'}
                placeholder={'请输入您的姓名'}
                returnKeyType={'done'}
                value={this.state.fullName}
                { ...Object.assign({}, this.props.full_name !== undefined ? { defaultValue: this.props.full_name } : {}) }
                onChangeText={text => this.setState({ fullName: text })}
                style={[styles.stdInput, styles.registerTextInput]} />
              <TextInput
                {...Define.TextInputArgs}
                clearTextOnFocus={false}
                placeholderTextColor={'#999'}
                placeholder={'请输入您的推荐人ID'}
                returnKeyType={'done'}
                value={this.state.referralUserId}
                { ...Object.assign({}, this.props.referrer_id !== undefined ? {
                  defaultValue: this.props.referrer_id,
                  editable: false
                } : {}) }
                onChangeText={text => this.setState({ referralUserId: text })}
                style={[styles.stdInput, styles.registerTextInput]} />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 25, justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: '#f2f2f2', fontWeight: '200' }}>点击「完成」视为您已阅读并同意</Text>
              <TouchableOpacity activeOpacity={.7} onPress={() => this.props.navigation.navigate('SettingWetView', { 
                title: '隐私协议及使用条款',
                source: { html: this.renderHtml(marked(require('../../resources/document/user.guide').markdown)) }
              })} style={{  }}>
                <Text style={{ fontSize: 12, color: '#ffa81d', fontWeight: '200' }}>《用户使用协议》</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 44 }}>
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={.9} onPress={this.onPressComplate.bind(this)}>
                <View style={{ height: 44, alignItems: 'center', flexDirection: 'row', backgroundColor: '#ffa81d', borderRadius: 22 }}>
                  <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '400', color: 'white' }}>完成</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={{ position: 'absolute', left: 15, top: 42, width: 120, height: 120 }}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }} 
              onPress={() => {
                if (isMail) {
                  this.props.dispatch(account.loginBack(1))
                } else {
                  this.props.dispatch(account.loginBack(2))
                }
              }}
            >
              { Icons.Generator.Material('keyboard-arrow-left', 38, 'white') }
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  registerTextInput: { borderColor: '#f2f2f2', borderBottomWidth: .8, height: 44, marginBottom: 15 },
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