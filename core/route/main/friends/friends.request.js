import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ScrollView, TextInput, Image, RefreshControl, ActivityIndicator
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { application } from '../../../redux/actions'
import { Icons, Screen, Session } from '../../../utils'

const { width, height } = Screen.window

export default connect(state => ({ account: state.account }))(class FriendsCircleComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '发送好友请求'
    }
  }

  constructor(props) {
    super(props)
    const { referrer, id } = props.navigation.state.params
    this.state = { referrer, id }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    const { referrer, id } = this.state
    const { data } = await Session.user.get(`v1/search?country=CN&userId=${referrer}`)
    if (!data || data.length === 0) return this.props.dispatch(application.showMessage('该邀请已失效'))
    console.log(data[0])
    const { _id, avatars, fullName, userId } = data[0]
    this.setState({ invite_id: _id, avatars: avatars[0], fullName, userId })
  }

  omponentWillUnmount() {
  }

  render() {
    const { invite_id, id, avatars = { url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }, fullName, userId } = this.state
    
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ flex: 1 }}>
        <View style={{ backgroundColor: 'white', paddingTop: 45, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fcfcfc' }}>
            <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: avatars.url }} />
            {
              !fullName && (
                <View style={{ position: 'absolute', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000033' }}>
                  <ActivityIndicator size="small" color="#333" />
                </View>
              )
            }
          </View>
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={{ color: '#333', fontSize: 15, fontWeight: '400', marginBottom: 2 }}>{ fullName }</Text>
            <Text style={{ color: '#666', fontSize: 12, fontWeight: '400' }}>{ userId }</Text>
          </View>
          {
            fullName && (
              <View style={{ flexDirection: 'row', marginTop: 45 }}>
                <TouchableOpacity onPress={async () => {
                  try {
                    const response = await Session.circle.post('v1/requests', { addFriend_id: id })
                    this.props.dispatch(application.showMessage('对方已收到你的好友请求，请等待对方确认'))
                  } catch (e) {
                    if (e.response && e.response.data && e.response.data.code === 'CIRCLE_REQUEST_EXIST') {
                      this.props.dispatch(application.showMessage('对方已收到你的好友请求，等待确认中')) 
                    } else {
                      this.props.dispatch(application.showMessage('发生错误，请稍后再试')) 
                    }
                  }
                }} activeOpacity={.7} style={{ backgroundColor: '#70c040', height: 44, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: '400' }}>发送好友请求</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={async () => {
                  const response = await Session.circle.put(`v1/requests/${invite_id}`, { 'action': 'reject' })
                  console.log(response)
                }} activeOpacity={.7} style={{ backgroundColor: '#f8f8f8', height: 38, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 15, fontWeight: '400' }}>拒绝</Text>
                </TouchableOpacity> */}
              </View>
            )
          }
        </View>
      </ScrollView>
    )
  }
})