
import React, { Component } from 'react'
import { View, Modal, Text } from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'

/*****************************************************************************************************/
import { System, Icons, Screen,TextFont } from '../utils'
/*****************************************************************************************************/

const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

class CodePushComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      indeterminate: true,
      progress: 0,
      visible: false
    }
    this.running = false
  }

  async componentDidMount() {
    const remoteBundle = await CodePush.checkForUpdate()
    if (!remoteBundle || this.state.visible) return
    this.setState({ visible: true })
    this.downloadBundle(remoteBundle)
  }

  async downloadBundle(remoteBundle) {
    if (!this.running) {
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

      await delay(2000)
      this.setState({ visible: false })
      await CodePush.notifyAppReady()
      await CodePush.restartApp()
    }
  }

  render() {
    const { indeterminate, progress, visible } = this.state

    return (
      <Modal onRequestClose={() => {}} animationType={'slide'} transparent={false} visible={visible}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#999', fontSize: TextFont.TextSize(24), fontWeight: '200', backgroundColor: 'transparent' }}>DACSEE</Text>
              <Text style={{ fontSize: TextFont.TextSize(16), backgroundColor: 'transparent', color: '#333', fontWeight: '600' }}>新的更新包可用</Text>
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
              <Text style={{ color: '#999', fontSize: TextFont.TextSize(12), fontWeight: '200', backgroundColor: 'transparent' }}>{ System.Version }</Text>
            </View>

          </View>
        </View>
      </Modal>
    )
  }

}

export default CodePushComponent
