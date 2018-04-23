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
  PermissionsAndroid,Platform
} from 'react-native'

import {Screen, Icons, Session, TextFont, Define, System} from '../../utils'
// import Voice from 'react-native-voice'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import PropTypes from 'prop-types'

const ViewPropTypes = RNViewPropTypes || View.propTypes
export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
}

const {height, width} = Dimensions.get('window')

export default class VoiceModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      type: '',
      opacityValue: new Animated.Value(this.props.opacity),

      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath,
      hasPermission: undefined,

    }
  }

  componentDidMount() {
    AudioRecorder.onProgress = (data) => {
      this.setState({currentTime: Math.floor(data.currentTime)})
    }
    AudioRecorder.onFinished = (data) => {
      // Android callback comes in the form of a promise instead.
      if (Platform.OS === 'ios') {
        this._finishRecording(data.status === 'OK', data.audioFileURL)
      }
    }
    // this._checkPermission().then((hasPermission) => {
    //   this.setState({ hasPermission })
    //
    //   if (!hasPermission) return
    //
    //   this.prepareRecordingPath(this.state.audioPath)
    //
    //
    // })
  }



  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000
    })
  }


  show(type) {
    this.setState({
      isShow: true,
      type,
      filename: AudioUtils.DocumentDirectoryPath + '/dacsee' + Date.now() + '.aac'
    })

    Animated.timing(
      this.state.opacityValue,
      {
        toValue: this.props.opacity,
        duration: this.props.fadeInDuration,
      }
    ).start(() => {
      this.isShow = true
    })
    // this.prepareRecordingPath(filename)
    this.prepareRecordingPath(this.state.filename)
    console.log(this.prepareRecordingPath(this.state.filename))
    this._record()
  }

  close() {
    // let delay = typeof duration === 'undefined' ? this.duration : duration
    //
    // if(delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 100
    //
    // if (!this.isShow && !this.state.isShow) return
    Animated.timing(
      this.state.opacityValue,
      {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
      }
    ).start(() => {
      this.setState({
        isShow: false,
      })
      this.isShow = false
    })
    // this.timer && clearTimeout(this.timer)
    // this.timer = setTimeout(() => {
    //   Animated.timing(
    //     this.state.opacityValue,
    //     {
    //       toValue: 0.0,
    //       duration: this.props.fadeOutDuration,
    //     }
    //   ).start(() => {
    //     this.setState({
    //       isShow: false,
    //     })
    //     this.isShow = false
    //     if(typeof this.callback === 'function') {
    //       this.callback()
    //     }
    //   })
    // }, delay)
    this._stop()
    console.log(this.state.currentTime)
    this.props.sendVoice('voice',this.state.audioPath,this.state.currentTime)
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
      console.warn('Can\'t stop, not recording!')
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

  // async _play() {
  //   if (this.state.recording) {
  //     await this._stop()
  //   }
  //
  //   // These timeouts are a hacky workaround for some issues with react-native-sound.
  //   // See https://github.com/zmxv/react-native-sound/issues/89.
  //   setTimeout(() => {
  //     var sound = new Sound(this.state.audioPath, '', (error) => {
  //       if (error) {
  //         console.log('failed to load the sound', error)
  //       }
  //     })
  //
  //     setTimeout(() => {
  //       sound.play((success) => {
  //         if (success) {
  //           console.log('successfully finished playing')
  //         } else {
  //           console.log('playback failed due to audio decoding errors')
  //         }
  //       })
  //     }, 100)
  //   }, 100)
  // }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!')
      return
    }

    // if (!this.state.hasPermission) {
    //   console.warn('Can\'t record, no permission granted!')
    //   return
    // }

    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath)
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
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}}`)
  }


  componentWillUnmount() {
    // Voice.destroy().then(Voice.removeAllListeners)
  }





  _renderContent() {
    const {type,currentTime} = this.state
    switch (type) {
    case 'normal':
      return (
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          { Icons.Generator.Ion('ios-mic', 70, '#fff') }
          <Text style={{color:'#fff',marginLeft:10}} >
            {currentTime}
          </Text>
        </View>
      )
    }
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
  fadeOutDuration: 200,
  opacity: 1,
  sendVoice:()=>{}
}