/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View, TouchableHighlight, Modal, Text, Animated, Alert, AppState } from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'

/*****************************************************************************************************/
import { System, Icons, Screen } from '../utils'
/*****************************************************************************************************/

/* eslint-enable */

/***
****

appVersion, deploymentKey, description, download,
downloadUrl, failedInstall, isMandatory, isPending,
label, packageHash, packageSize

***/

export default connect(({ application }) => ({ }))(class _ extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busy: true,
      progress: 0,
      progressView: new Animated.Value(1),
      successView: new Animated.Value(0),
      visible: false,
      remoteBundle: undefined,
      runningBundle: undefined
    }
    this.atom = false
  }

  //TODO: REDUX SAGA

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.checkAutoUpdate()
  }

  async checkAutoUpdate() {
    // const remoteBundle = await CodePush.checkForUpdate()
    // if (!remoteBundle || this.atom) return undefined
    // this.atom = true

    // const runningBundle = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
    // this.setState({ remoteBundle, runningBundle, visible: true })
    // this.beginDownload()
    this.setState({ visible: false })
  }

  async beginDownload() {
    const { remoteBundle } = this.state

    await program.delay(2050)
    this.setState({ busy: false })
    const localBundle = await remoteBundle.download(progress => {
      const { receivedBytes, totalBytes } = progress
      const rate = (receivedBytes / totalBytes).toFixed(2)
      if (receivedBytes < totalBytes) return this.setState({ progress: parseFloat(rate) })
      this.setState({ progress: 1 })
    })
    this.beginInstall(localBundle)
  }

  async beginInstall(localBundle) {
    await program.delay(1500)
    this.setState({ busy: true })
    await program.delay(1000)
    await localBundle.install()
    Animated.parallel([
      Animated.timing(this.state.progressView, {
        toValue: 0
      }),
      Animated.timing(this.state.successView, {
        toValue: 1
      })
    ]).start()
    await program.delay(1000)
    Alert.alert('更新完成', '点击确定后应用将重新载入', [
      { text: '确定', onPress: async () => {
        await CodePush.notifyAppReady()
        await CodePush.restartApp()
      }}
    ])
  }

  installDidComplete() {
    this.setState({
      busy: true,
      progress: 0,
      progressView: new Animated.Value(1),
      successView: new Animated.Value(0)
    })
    this.atom = false
  }

  render() {
    const { busy, progress, successView, progressView, visible, remoteBundle, runningBundle } = this.state
    const { appVersion, download, label = '', packageSize } = remoteBundle || {}
    const latestVer = label.length > 0 ? `${System.Version}.${label}` : `${System.Version}.0`
    const runningVer = (runningBundle && ('label' in runningBundle)) ? `${System.Version}.${runningBundle.label}` : `${System.Version}.0`

    return (
      <Modal onRequestClose={() => {}} animationType={'fade'} transparent={false} visible={visible}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#999', fontSize: 24, fontWeight: '200', backgroundColor: 'transparent' }}>DACSEE</Text>
              <Text style={{ fontSize: 16, backgroundColor: 'transparent', color: '#333', fontWeight: '600' }}>新的更新包可用</Text>
            </View>

            <View style={{ justifyContent: 'center', height: 120, alignItems: 'center', backgroundColor: 'transparent' }}>
              <Progress.Bar 
                width={Screen.Window.Width - 80}
                height={2}
                borderRadius={1}
                useNativeDriver={true}
                borderWidth={0}
                progress={0.3}
                // indeterminate={true}
                color={'#666'}
                unfilledColor={'#eee'}
              />
            </View>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#999', fontSize: 12, fontWeight: '200', backgroundColor: 'transparent' }}>0.2.0</Text>
            </View>

          </View>
        </View>
      </Modal>
    )
  }

})
