import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, StyleSheet, Image, ScrollView, Alert
} from 'react-native'
import { connect } from 'react-redux'

import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import { join } from 'redux-saga/effects'

import { application, circle } from '../../../redux/actions'
import { Icons, Screen, Session, TextFont, Define } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  booking: state.booking,
  i18n: state.intl.messages || {}
}))(class FriendsCircleDetailComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const { i18n } = navigation.state.params
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
    const { i18n, type } = this.props.navigation.state.params
    if (index === 0) {
      this.props.dispatch(application.showMessage(i18n.already_report_check))
    }
    if (index === 1 && type === 'FRIEND') {
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
            this.props.dispatch(application.showMessage(i18n.timeout_try_again))
          }
        }
      }, { text: i18n.cancel }])
    }
  }
  async onPressAccept(requestor_id){
    const { i18n } = this.props.navigation.state.params
    try {
      const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'accept' })
    } catch (e) {
      this.props.dispatch(application.showMessage(i18n.error_try_again))
    } finally {
      this.props.dispatch(circle.asyncFetchFriends({ init: true }))
    }
    this.props.navigation.goBack()
  }
  async onPressReject(requestor_id){
    const { i18n } = this.props.navigation.state.params
    try {
      const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'reject' })
    } catch (e) {
      this.props.dispatch(application.showMessage(i18n.error_try_again))
    } finally {
      this.props.dispatch(circle.asyncFetchFriends({ init: true }))
    }
    this.props.navigation.goBack()
  }
  render() {
    const { i18n } = this.props
    const { dataSource } = this.state
    const { _id, checked, friend_id, friend_info = this.props.navigation.state.params.requestor_info, requestor_id, type } = this.props.navigation.state.params
    const { fullName, email, phoneCountryCode, phoneNo, userId, avatars = [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }] } = friend_info
   
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{}} style={{ backgroundColor: 'white' }}>
          <View style={{ height: height * 0.25, backgroundColor: '#1ab2fd', alignItems: 'center', paddingHorizontal: 25 }}>
            {/*<View style={{marginTop: 10}}>*/}
            <View style={{ marginTop: 10 }}>
              <Image style={styles.avatar} source={{ uri: avatars[avatars.length - 1].url }} />
              <View style={{ backgroundColor: '#7ed321', height: 18, width: 18, position: 'absolute', bottom: 8, right: 8, borderRadius: 9 }} />
            </View>
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={{ color: 'white', fontSize: TextFont.TextSize(22), marginTop: 10 }}>{fullName}</Text>
            {/*</View>*/}
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 10, }}>
            <ListItem i18n={i18n.userid} params={userId} />
            <ListItem i18n={i18n.phone} params={phoneCountryCode} />
            <ListItem i18n={i18n.email} params={email || i18n.no_content} />
            <ListItem i18n={i18n.country} params={i18n.no_content} />

            {/*<View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'green' }}>*/}
            {/*<Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.userid }</Text>*/}
            {/*{ userId && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ userId }</Text>) }*/}
            {/*</View>*/}
            {/*<View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>*/}
            {/*<Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.phone }</Text>*/}
            {/*{ phoneNo && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>({ phoneCountryCode }) { phoneNo }</Text>) }*/}
            {/*</View>*/}
            {/*<View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>*/}
            {/*<Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.email }</Text>*/}
            {/*<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ email || i18n.no_content}</Text>*/}
            {/*</View>*/}
            {/*<View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>*/}
            {/*<Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400', marginBottom: 6 }}>{ i18n.country }</Text>*/}
            {/*<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ i18n.no_content }</Text>*/}
            {/*</View>*/}
          </View>
        </ScrollView>

        { type === 'FRIEND' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={async () => {
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
                    this.props.dispatch(application.showMessage(i18n.timeout_try_again))
                  }
                }
              }, { text: i18n.cancel }])
            }} activeOpacity={.7} style={styles.sendRequest}>
              <Text style={{ color: 'white', fontSize: TextFont.TextSize(18), fontWeight: 'bold' }}>{i18n.friend_delete}</Text>
            </TouchableOpacity>
          </View>
        )}
        { type === 'REQUEST' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginHorizontal:20, marginBottom:Define.system.ios.x ?42: 20 }}>
            <TouchableOpacity onPress={() => this.onPressReject(_id)}
              activeOpacity={.7} style={{ width: width/3, height: 40, borderRadius: 25, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.reject}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>this.onPressAccept(_id)} 
              activeOpacity={.7} style={{ width:  width/3, height: 40, borderRadius: 25, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.accept}</Text>
            </TouchableOpacity>
          </View>
        )}
        <ActionSheet
          ref={e => this.ActionSheet = e}
          title={i18n.more}
          options={type === 'FRIEND' ? [i18n.friend_report, i18n.friend_delete, i18n.cancel] : [i18n.friend_report, i18n.cancel]}
          cancelButtonIndex={2}
          destructiveButtonIndex={0}
          onPress={this._pressActionSheet.bind(this)}
        />
      </View>
    )
  }
})

function ListItem(props) {
  const { i18n, params } = props
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
      <Text style={{ fontSize: TextFont.TextSize(16), color: '#999', fontWeight: '400' }}>{i18n}</Text>
      {params && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400' }}>{params}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#106e9d',
    backgroundColor: '#1ab2fd',
  },
  sendRequest: {
    height: 66,
    marginBottom:Define.system.ios.x ?42: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    // height: 33,
    borderRadius: 36,
    backgroundColor: '#ff2239',
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
  },
})