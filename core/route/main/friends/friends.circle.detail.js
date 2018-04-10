import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, ScrollView, Alert
} from 'react-native'
import { connect } from 'react-redux'

import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import { join } from 'redux-saga/effects'

import { application, circle } from '../../../redux/actions'
import { Icons, Screen, Session,TextFont } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  booking: state.booking,
  i18n: state.intl.messages || {}
}))(class FriendsCircleDetailComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const { _id, checked, friend_id, friend_info,i18n} = navigation.state.params
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
      title: i18n.friend_detail,
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
    const {i18n} = this.props.navigation.state.params
    if (index === 0) {
      this.props.dispatch(application.showMessage('已将您的反馈提交至服务器，我们将会严格审查'))
    }
    if (index === 1) {
      Alert.alert(i18n.friend_delete, i18n.del_friend_confirm, [{
        text: i18n.confirm,
        onPress: async () => {
          try {
            const { _id } = this.props.navigation.state.params
            await Session.Circle.Delete(`v1/circle/${_id}`)
            this.props.dispatch(circle.asyncFetchFriends({ init: true }))
            Alert.alert(i18n.finish, i18n.already_del_friend, [{ text: i18n.confirm, onPress: () => this.props.navigation.goBack() }])
          } catch (e) {
            console.log(e)
            this.props.dispatch(application.showMessage('请求超时，请稍后再试'))
          }
        }
      }, { text: i18n.cancel}])
    }
  }

  render() {
    const { i18n } = this.props
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
              <Text style={{ color: 'white', fontSize: TextFont.TextSize(18), fontWeight: '600' }}>{ fullName }</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.userid }</Text>
              { userId && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ userId }</Text>) }
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.phone }</Text>
              { phoneNo && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>({ phoneCountryCode }) { phoneNo }</Text>) }
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.email }</Text>
              <Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ email || i18n.no_content}</Text>
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.country }</Text>
              <Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ i18n.no_content }</Text>
            </View>
          </View>
        </ScrollView>
        <ActionSheet
          ref={e => this.ActionSheet = e}
          title={i18n.more}
          options={[i18n.friend_report, i18n.friend_delete, i18n.cancel]}
          cancelButtonIndex={2}
          destructiveButtonIndex={0}
          onPress={this._pressActionSheet.bind(this)}
        />
      </View>
    )
  }
})
