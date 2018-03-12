import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import { join } from 'redux-saga/effects';

import { application } from '../../../redux/actions'
import { Icons, Screen } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ booking: state.booking }))(class FriendsCircleDetailComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const { _id, checked, friend_id, friend_info } = navigation.state.params
    const { fullName, email, phoneCountryCode, phoneNo, userId, avatars } = friend_info
    
    return {
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.MORE.FREIENDS')}
        >
          {Icons.Generator.Material('more-horiz', 28, '#2f2f2f', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      title: `${fullName}`
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([]),
      loading: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.MORE.FREIENDS', () => this.ActionSheet.show())
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  _pressActionSheet(index) {
    if (index === 0) {
      this.props.dispatch(application.showMessage('已将您的反馈提交至服务器，我们将会严格审查'))
    }
    if (index === 1) {
      this.props.dispatch(application.showMessage('Error'))
    }
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{}} style={{ backgroundColor: 'white' }}>
          <View style={{  }}>
            
          </View>
        </ScrollView>
        <ActionSheet
          ref={e => this.ActionSheet = e}
          title={'更多'}
          options={['举报违规', '解除朋友关系', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={0}
          onPress={this._pressActionSheet.bind(this)}
        />
      </View>
    )
  }
})