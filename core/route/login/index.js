import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, 
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView, Easing, I18nManager, TouchableNativeFeedback, Platform, Keyboard } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { Screen, Icons, Redux, Define } from '../../utils'
import resources from '../../resources'
import { Button } from '../../components'
import { application, account } from '../../redux/actions'

const codeInputWidth = ((Screen.Window.Width - 40 * 2) - 35 * 3) / 4
const codeInputProps = {
  maxLength: 1,
  returnKeyType: 'next',
  placeholderTextColor: '#eee',
  keyboardType: 'numeric',
  clearTextOnFocus: false
}

export default Redux.connectAndBindAction(state => ({}), Object.assign({}, application, account))
(class LoginScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null   
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      stage: 0,
      v1: '',
      v2: '',
      v3: '',
      v4: ''
    }
    this.codeInput = {}
    this.animated = {}
    this.animated.enterLogin = new Animated.Value(0)
    this.animated.isMail = new Animated.Value(1)
  }

  async componentDidMount() {}
  componentWillUnmount() {}

  goStage1() {
    Animated.timing(this.animated.enterLogin, { toValue: 2, duration: 600, easing: Easing.linear })
    .start(() => this.setState({ stage: 1 }))
  }

  goStage2() {
    Animated.timing(this.animated.enterLogin, { toValue: 3, duration: 200, easing: Easing.linear })
    .start(() => this.setState({ stage: 2 }))
  }

  async backStage1() {
    Animated.timing(this.animated.enterLogin, { toValue: 2, duration: 200, easing: Easing.linear})
    .start(this.setState({ stage: 1 }))
  }

  async backStage0() {
    Animated.timing(this.animated.enterLogin, { toValue: 0, duration: 500, easing: Easing.linear})
    .start(this.setState({ stage: 0 }))
  }

  stageHandle() {
    const { stage } = this.state
    if (stage === 0) return this.goStage1()
    if (stage === 1) {
      this.goStage2()
      this.codeInput.v1.focus()
    }
    if (stage === 2) {
      Keyboard.dismiss()
      this.backStage1()
      this.codeInput.v1.clear()
      this.codeInput.v2.clear()
      this.codeInput.v3.clear()
      this.codeInput.v4.clear()
    }
  }

  backgroundHandle() {
    Keyboard.dismiss()
    if (this.state.stage === 2) return;
    this.backStage0()
  }

  isEmail(val) { 
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
    return reg.test(val); 
  }

  

  // TODO: Optimize Style
  render() {
    const { Width, Height } = Screen.Window
    const { enterLogin, isMail } = this.animated
    const { stage } = this.state

    return (
      <View style={{ flex: 1 }}>
        {/**/}
        <Image resizeMode={'cover'} style={{ width: Width, height: Height }} source={resources.image.login_bg} />
        <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={this.backgroundHandle.bind(this)} activeOpacity={1}>
          <Animated.View style={[
            { flex: 1 },
            { backgroundColor: enterLogin.interpolate({ inputRange: [0, 0.6, 2], outputRange: ['#33333300', '#33333373', '#33333373'] }) }
          ]} />
        </TouchableOpacity>

        <Animated.Image style={[
          { height: 80, width: 80, resizeMode: 'contain', position: 'absolute' },
          { top: enterLogin.interpolate({ inputRange: [0, .8, 1, 2], outputRange: [80, 80, 110, 110], extrapolate: 'clamp' }) },
          { left: enterLogin.interpolate({ inputRange: [0, .5, .9, 1, 2], outputRange: [35, 35, -150, Width, (Width / 2) - 40], extrapolate: 'clamp' }) },
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
          { left: enterLogin.interpolate({ inputRange: [0, .5, .9, 1.4, 2], outputRange: [35, 35, -150, Width, (Width / 2) - 62], extrapolate: 'clamp' }) },
          { opacity: enterLogin.interpolate({ inputRange: [0, .8, 1, 1.3, 2], outputRange: [1, 0, 0, 0, 1], extrapolate: 'clamp' }) }
        ]}>DACSEE</Animated.Text>

        <Animated.View style={[
          { position: 'absolute', right: 0, top: (Height / 2) - 60 },
          { justifyContent: 'center' },
          { left: enterLogin.interpolate({ inputRange: [0, 1.2, 2, 3], outputRange: [-Width, 0, 0, -Width], extrapolate: 'clamp' }) },
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
              placeholderTextColor={'#eee'}
              placeholder={'Phone Number / Email'}
              onChangeText={text => {
                if (this.isEmail(text)) return Animated.timing(this.animated.isMail, { toValue: 1, duration: 250, easing: Easing.linear}).start()
                Animated.timing(this.animated.isMail, { toValue: 0, duration: 250, easing: Easing.linear}).start()
              }}
              style={[ styles.stdInput, { flex: 7, borderColor: '#f2f2f2', borderBottomWidth: 1, height: 44 } ]} />
          </View>
        </Animated.View>

        <Animated.View style={[
          { position: 'absolute', right: 0, top: (Height / 2) - 60 },
          { justifyContent: 'center' },
          { left: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [Width, Width, 0], extrapolate: 'clamp' }) },
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
              onChangeText={text => {
                this.setState({ v4: text })
                if (text.length === 0) return this.codeInput.v3.focus()
                const { v1, v2, v3, v4 } = this.state
                this.props.requestVerify(`${v1}${v2}${v3}${v4}`)
                Keyboard.dismiss()
              }} />
          </View>
        </Animated.View>

        <Animated.View style={[
          { position: 'absolute', height: 44, overflow: 'hidden' },
          { top: Platform.select({
            ios: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [Height - 44, (Height / 2) + 24, (Height / 2) + 24]}),
            android: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [Height - 44 - 22, (Height / 2) + 24, (Height / 2) + 24]}),
          })},
          { right: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35]}) },
          { left: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 35, 35]}) },
          { borderRadius: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 22, 22]}) },
        ]}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={.9} onPress={this.stageHandle.bind(this)}>
            <Animated.View style={[
              { flex: 1, alignItems: 'center', flexDirection: 'row' },
              { backgroundColor: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: ['#ffa81d', '#ffa81d', '#ffa81d'], extrapolate: 'clamp' }) },
              { width: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [Width * 3, (Width - 70) * 3, (Width - 70) * 3], extrapolate: 'clamp' }), }
            ]}>
              <Animated.Text style={[
                { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: 'white' },
                { opacity: enterLogin.interpolate({ inputRange: [0, 1.4, 1.8, 2], outputRange: [1, 1, 0, 0], extrapolate: 'clamp' }) },
                { left: enterLogin.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 0, -(Width - 70)], extrapolate: 'clamp' }) }
              ]}>LOGIN</Animated.Text>
              <Animated.View style={[
                { flex: 1, alignItems: 'center' },
                { opacity: enterLogin.interpolate({ inputRange: [0, 1.5, 1.9, 2, 2.4], outputRange: [0, 0, 1, 1, 0], extrapolate: 'clamp' }) },
                { left: enterLogin.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [0, 0, -(Width - 70), -((Width - 70) * 2)], extrapolate: 'clamp' }) }
              ]}>
                { Icons.Generator.Material('arrow-forward', 28, 'white') }
              </Animated.View>
              <Animated.View style={[
                { flex: 1, alignItems: 'center' },
                { opacity: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, 1], extrapolate: 'clamp' }) },
                { left: enterLogin.interpolate({ inputRange: [0, 2, 3], outputRange: [0, 0, -((Width - 70) * 2)], extrapolate: 'clamp' }) }
              ]}>
                { Icons.Generator.Material('arrow-back', 28, 'white') }
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[
          { position: 'absolute', right: 0, top: (Height / 2) + 120 },
          { justifyContent: 'center', alignItems: 'center' },
          { left: enterLogin.interpolate({ inputRange: [0, 1.2, 2], outputRange: [-Width, 0, 0], extrapolate: 'clamp' }) },
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