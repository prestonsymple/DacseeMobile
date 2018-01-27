/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View, TouchableHighlight, Modal, Text, Animated, Alert, AppState } from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'

/*****************************************************************************************************/
import { System, Icons, Screen } from '../utils'
import { application } from '../redux/actions'
/*****************************************************************************************************/

/* eslint-enable */

/***
****

appVersion, deploymentKey, description, download,
downloadUrl, failedInstall, isMandatory, isPending,
label, packageHash, packageSize

***/

const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

export default connect(({ application }) => ({ 
  remoteBundle: application.update_remote_bundle
}))(class _ extends Component {

  constructor(props) {
    super(props)
    this.state = {
      indeterminate: true,
      progress: 0
    }
    this.running = false
  }

  componentWillReceiveProps(props) {
    if (props.remoteBundle === null || this.running) return;
    
    this.downloadBundle(props.remoteBundle)
  }

  async downloadBundle(remoteBundle) {
    this.running = true
    await delay(3100)
    this.setState({ indeterminate: false })
    const bundle = await remoteBundle.download(progress => {
      const { receivedBytes, totalBytes } = progress
      const rate = (receivedBytes / totalBytes).toFixed(2)
      if (receivedBytes < totalBytes) {
        this.setState({ progress: parseFloat(rate) })
      } else {
        this.setState({ progress: 1 })
      }
    })

    await delay(1500)
    this.setState({ indeterminate: true })
    await bundle.install()
    await delay(1000)
    this.setState({ indeterminate: false, progress: 100 })

    Alert.alert('更新完成', '重启应用后完成更新', [
      { text: '确定', onPress: async () => {
        this.props.dispatch(application.finshUpdate())
        await CodePush.notifyAppReady()
        await CodePush.restartApp()
      }}
    ])
  }

  render() {
    const { remoteBundle } = this.props
    const { indeterminate, progress } = this.state

    return (
      <Modal onRequestClose={() => {}} animationType={'slide'} transparent={false} visible={remoteBundle !== null}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#999', fontSize: 24, fontWeight: '200', backgroundColor: 'transparent' }}>DACSEE</Text>
              <Text style={{ fontSize: 16, backgroundColor: 'transparent', color: '#333', fontWeight: '600' }}>新的更新包可用</Text>
            </View>

            <View style={{ justifyContent: 'center', height: 120, alignItems: 'center', backgroundColor: 'transparent' }}>
              <Progress.Bar 
                width={Screen.window.width - 80}
                height={2}
                borderRadius={1}
                useNativeDriver={true}
                borderWidth={0}
                progress={progress}
                indeterminate={indeterminate}
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
