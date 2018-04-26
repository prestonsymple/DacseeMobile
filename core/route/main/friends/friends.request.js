/* global store */
import React, { PureComponent, Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ScrollView,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  StyleSheet
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { application } from '../../../redux/actions'
import { Icons, Screen, Session,TextFont } from '../../../utils'

const { width, height } = Screen.window

export default connect(state => ({ 
  account: state.account, 
  i18n: state.intl.messages || {} 
}))(class FriendsCircleComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {
    const i18n = store.getState().intl.messages || {}
    return {
      drawerLockMode: 'locked-closed',
      title: i18n.send_friend_request,
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
    }
  }

  async componentDidMount() {
    const { i18n } = this.props
    const { referrer, id } = this.props.navigation.state.params
    await InteractionManager.runAfterInteractions()
    const data = await Session.User.Get(`v1/search?country=CN&userId=${referrer}`)
    // console.log('data', data)
    // console.log('referrer',referrer)
    // console.log('id', id)
    if (!data || data.length === 0) return this.props.dispatch(application.showMessage(i18n.invitation_failure))
    const { _id, avatars= [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }], fullName, userId } = data[0]
    this.setState({ invite_id: _id, avatars: avatars[avatars.length - 1], fullName, userId })
  }

  omponentWillUnmount() {
  }

  render() {
    const { invite_id, avatars = { url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }, fullName, userId } = this.state
    const { i18n = {} } = this.props

    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'white' }} style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#1ab2fd',  height: height * 0.25,  alignItems: 'center' }}>
            <Image style={styles.avatar} source={{ uri: avatars.url }} />
            {
              !fullName && (
                <View style={{ position: 'absolute',marginTop: 10, width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' }}>
                  <ActivityIndicator size="small" color="#333" />
                </View>
              )
            }
            <Text style={{ color: 'white', fontSize: TextFont.TextSize(25), marginTop: 10 }}>{ fullName }</Text>
            {/*<Text style={{ color: '#666', fontSize: TextFont.TextSize(12), fontWeight: '400' }}>{ userId }</Text>*/}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white', marginTop: 10, paddingHorizontal: 20}}>
            <Text style={{fontSize: TextFont.TextSize(16), color:'#000',}}>{ i18n.userid }</Text>
            <Text style={{fontSize: TextFont.TextSize(16), color:'#000', opacity: 0.7,}}>{userId}</Text>
          </View>
        </ScrollView>
        {fullName && (
          <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={async () => {
              try {
                const response = await Session.Circle.Post('v1/requests', { addFriend_id: invite_id })
                this.props.dispatch(application.showMessage(i18n.already_send_wait_confirm))
              } catch (e) {
                if (e.response && e.response.data && e.response.data.code === 'CIRCLE_REQUEST_EXIST') {
                  this.props.dispatch(application.showMessage(i18n.already_send_wait_confirm))
                } else if (e.response && e.response.data && e.response.data.code === 'ALREADY_IN_CIRCLE') {
                  this.props.dispatch(application.showMessage(i18n.already_friend))
                } else {
                  this.props.dispatch(application.showMessage(i18n.error_try_again))
                }
              }
            }} activeOpacity={.7} style={styles.sendRequest}>
              <Text style={{ color: 'black', fontSize: TextFont.TextSize(18), fontWeight: 'bold' }}>{i18n.send_friend_request}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={async () => {
        const response = await Session.circle.put(`v1/requests/${invite_id}`, { 'action': 'reject' })
        console.log(response)
        }} activeOpacity={.7} style={{ backgroundColor: '#f8f8f8', height: 38, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#666', fontSize: 15, fontWeight: '400' }}>拒绝</Text>
        </TouchableOpacity> */}
          </View>
        )}
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#106e9d',
    marginTop: 10,
    backgroundColor: '#1ab2fd',

  },
  sendRequest:{
    height: 66,
    marginBottom: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 60,
    // height: 33,
    borderRadius: 36,
    backgroundColor: '#7dd320',
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1
  }
})