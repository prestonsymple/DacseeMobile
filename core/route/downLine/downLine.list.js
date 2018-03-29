import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, TouchableOpacity,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import moment from 'moment'
import FONT from '../../utils/util.textSize'
import { Screen } from '../../utils'

import { application, booking } from '../../redux/actions'
import UserList from './components/user.list'
const { height, width } = Screen.window
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
export default connect(() => ({}))(class DownLineListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '一级列表',
      headerStyle: {
        backgroundColor: '#1AB2FD',
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
      loading: false,
      data: {
        'level': 1,
        'users': [
          {
            '_id': '5a697a7333f82544619072dd',
            'fullName': 'Test User 1.1',
            'avatars': [
              {
                'url': 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'
              }
            ],
            'totalDownline': 2,
            'userId': 'NS-4352533'
          },
          {
            '_id': '5a697af033f82544619072de',
            'fullName': 'Test User 1.2',
            'avatars': [
              {
                'url': 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'
              }
            ],
            'totalDownline': 0,
            'userId': 'SN-8603898'
          }
        ]
      },
      total: 1
    }
  }

  async componentWillMount() {
    this._fetchData()
  }

  async _fetchData(index = 0) {
    this.setState({
      loading: true
    })
    try {
      //获取列表 s
      //const resp = await Session.Booking.Get('v1/bookings?role=passenger')
      this.setState({
        loading: false,

      })
    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器'))
      this.setState({
        loading: false
      })
    }
  }
  goUserDetails(_id) {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'DownLineDetail',
      params: { _id: _id }
    }))
  }
  render() {
    const { data } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ backgroundColor: '#1AB2FD', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', paddingBottom: 15 }}>{'LEVEL '+data.level}</Text>
          <Text style={{ fontSize: 15, color: '#fff', marginBottom: 5 }}>Total Downline</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#fff', marginBottom: 15 }}>{data.users.length}</Text>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._fetchData.bind(this)}
            title={'下拉进行刷新'}
            colors={['#ffffff']}
            progressBackgroundColor={'#1c99fb'}
          />
        }>
          <UserList users={data.users} goUserDetails={(_id) => this.goUserDetails(_id)} />
        </ScrollView>
      </View>
    )
  }
})


