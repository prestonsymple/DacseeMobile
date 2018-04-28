/**
 * @flow
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  ViewPropTypes as RNViewPropTypes,
  PermissionsAndroid,Platform,ActivityIndicator
} from 'react-native'

import {Screen, Icons, Session, TextFont, Define, System} from '../../utils'
import Lottie from 'lottie-react-native'
import Resources from '../../resources'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import PropTypes from 'prop-types'
const ViewPropTypes = RNViewPropTypes || View.propTypes

const {height, width} = Dimensions.get('window')

export default class VoiceModal extends Component {

  constructor(props) {
    super(props)
    this.timer = null
    this.state = {
      isShow: false,
      opacityValue: new Animated.Value(this.props.opacity),
      progress: new Animated.Value(0),
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: '' ,
      error:false,
      hasPermission: undefined,
      waiting:true,
      volume:0
    }
  }

  componentDidMount() {
    this.initPath()
    AudioRecorder.onProgress = (data) => {
      this.setState({waiting:false,currentTime: Math.floor(data.currentTime),volume: Math.floor(data.currentMetering)})
    }
    AudioRecorder.onFinished = (data) => {
      // Android callback comes in the form of a promise instead.
      if (Platform.OS === 'ios') {
        this._finishRecording(data.status === 'OK', data.audioFileURL)
      }
    }
    this.checkAuthorizationStatus()
    this.requestAuthorization()
    System.Platform.Android && this._checkPermission()
  }

  async checkAuthorizationStatus(){
    try{
      const res = await AudioRecorder.checkAuthorizationStatus()
      console.log(res)
    }catch (e) {
      console.log(e)
    }
  }
  async requestAuthorization(){
    try{
      const res = await AudioRecorder.requestAuthorization()
      console.log(res)
    }catch (e) {
      console.log(e)
    }
  }


  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true,
    })
  }


  show() {
    const {hasPermission} = this.state
    if (System.Platform.Android && !hasPermission) {
      console.warn('Can\'t record, no permission granted!')
      return
    }
    this.setState({
      isShow: true,
    })

    Animated.timing(
      this.state.opacityValue,
      {
        toValue: this.props.opacity,
        duration: this.props.fadeInDuration,
      }
    ).start()
    this._record()
    this._setProgress()
  }

  close() {
    console.log(this.state.currentTime)
    const {currentTime} =this.state
    if(currentTime<1){
      this.setState({error:true})
    }
    const delay_time= currentTime<1?1000:0
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(()=>this.delay_close(),delay_time)
    this._stop()
    currentTime>=1 && this.props.sendVoice('voice',this.state.audioPath,this.state.currentTime)
    this.initPath()
  }

  initPath(){
    const nowPath =`${AudioUtils.CachesDirectoryPath}/voice${Date.now()}.aac`
    this.setState({audioPath:nowPath,currentTime:0})
    this.prepareRecordingPath(nowPath)
  }

  delay_close(){
    Animated.timing(
      this.state.opacityValue,
      {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
      }
    ).start(() => {
      this.setState({
        isShow: false,
        error:false,
        waiting:true
      })
      this._reload()
    })
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!')
      return
    }

    try {
      const filePath = await AudioRecorder.pauseRecording()
      this.setState({paused: true})
    } catch (error) {
      console.error(error)
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn('Can\'t resume, not paused!')
      return
    }

    try {
      await AudioRecorder.resumeRecording()
      this.setState({paused: false})
    } catch (error) {
      console.error(error)
    }
  }

  async _stop() {
    if (!this.state.recording) {
      return
    }
    this.setState({stoppedRecording: true, recording: false, paused: false})
    try {
      const filePath = await AudioRecorder.stopRecording()

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath)
      }
      return filePath
    } catch (error) {
      console.error(error)
    }
  }

  async _checkPermission() {
    try{
      const rationale = {
        'title': 'Microphone Permission',
        'message': 'AudioExample needs access to your microphone so you can record audio.'
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      console.log(granted)
      this.setState({hasPermission:granted === PermissionsAndroid.RESULTS.GRANTED})
    }catch (e) {
      console.log(e)
    }
  }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!')
      return
    }

    if(this.state.stoppedRecording){
      this.initPath()
    }

    this.setState({recording: true, paused: false})

    try {
      const filePath = await AudioRecorder.startRecording()
    } catch (error) {
      console.error(error)
    }
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed })
  }

  _setProgress(){
    Animated.loop(Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 3000,
    }).start())
  }

  _reload(){
    Animated.timing(this.state.progress, {
      toValue: 0,
      duration: 3000,
    }).start()
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
  }





  _renderContent() {
    const {currentTime,error,waiting} = this.state
    return (
      error ? <View style={{justifyContent:'center',alignItems:'center'}}>
        {Icons.Generator.Awesome('exclamation', 70, '#fff')}
        <Text style={{color:'#fff'}}>说话时间太短</Text>
      </View>:
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          {/*{Icons.Generator.Ion('ios-mic', 70, '#fff') }*/}
          {/*<Text style={{color:'#fff',marginLeft:10}} >*/}
          {/*{currentTime}*/}
          {/*</Text>*/}
          {
            waiting ? <ActivityIndicator color={'#fff'} size="large"/> :
              <View style={{width:140,height:140}}>
                <Lottie source={Resources.animation.speech_start} progress={this.state.progress} loop={true}/>
              </View>
          }
        </View>
    )
  }

  render() {
    let pos = (height-64-44-200)/2
    const view = this.state.isShow ?
      <View
        style={[styles.container, { top: pos }]}
        pointerEvents="none"
      >
        <Animated.View
          style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}
        >
          { this._renderContent()}
        </Animated.View>
      </View> : null
    return view
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 999,
    alignItems: 'center',
    zIndex: 10000,
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    width:150,
    height:150,
    opacity:0.6
  },
  text: {
    color: 'white'
  }
})

VoiceModal.propTypes = {
  style: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  positionValue:PropTypes.number,
  fadeInDuration:PropTypes.number,
  fadeOutDuration:PropTypes.number,
  opacity:PropTypes.number,
  sendVoice:PropTypes.func
}

VoiceModal.defaultProps = {
  textStyle: styles.text,
  positionValue: 120,
  fadeInDuration: 500,
  fadeOutDuration:200,
  opacity: 1,
  sendVoice:()=>{}
}
