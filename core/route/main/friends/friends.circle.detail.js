import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, ScrollView, Alert
} from 'react-native'
import { connect } from 'react-redux'

import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import { join } from 'redux-saga/effects';

import { application, circle } from '../../../redux/actions'
import { Icons, Screen, Session } from '../../../utils'

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
          {Icons.Generator.Material('more-horiz', 28, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      title: '朋友详情',
      headerStyle: {
        backgroundColor: '#1ab2fd',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      }
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
      Alert.alert('解除朋友关系', '确认解除朋友关系吗？该操作不可恢复', [{
        text: '确认',
        onPress: async () => {
          try {
            const { _id } = this.props.navigation.state.params
            await Session.circle.delete(`v1/circle/${_id}`)
            this.props.dispatch(circle.asyncFetchFriends({ init: true }))
            Alert.alert('完成', '朋友身份已解除', [{ text: '确定', onPress: () => this.props.navigation.goBack() }])
          } catch (e) {
            console.log(e)
            this.props.dispatch(application.showMessage('请求超时，请稍后再试')) 
          }
        }
      }, { text: '取消' }])
    }
  }

  render() {
    const { dataSource } = this.state
    const { _id, checked, friend_id, friend_info } = this.props.navigation.state.params
    const { fullName, email, phoneCountryCode, phoneNo, userId, avatars } = friend_info

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{}} style={{ backgroundColor: 'white' }}>
          <View style={{ height: 161, backgroundColor: '#1ab2fd', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ borderColor: '#106e9d', borderWidth: 4, borderRadius: 60, marginBottom: 10 }}>
                <Image style={{ width: 88, height: 88, borderRadius: 44 }} source={{ uri: avatars[avatars.length - 1].url }} />
                <View style={{ backgroundColor: '#7ed321', height: 18, width: 18, position: 'absolute', bottom: 2, right: 2, borderRadius: 9 }} />
              </View>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>{ fullName }</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#999', fontWeight: '400', marginBottom: 6 }}>用户编号</Text>
              { userId && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ userId }</Text>) }
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#999', fontWeight: '400', marginBottom: 6 }}>联系电话</Text>
              { phoneNo && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>({ phoneCountryCode }) { phoneNo }</Text>) }
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#999', fontWeight: '400', marginBottom: 6 }}>电子邮箱</Text>
              <Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ email || '尚未填写' }</Text>
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#999', fontWeight: '400', marginBottom: 6 }}>国家</Text>
              <Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ '尚未填写' }</Text>
            </View>
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