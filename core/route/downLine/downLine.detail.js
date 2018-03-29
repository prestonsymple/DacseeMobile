import React, { Component, PureComponent } from 'react'
import {
  Text, View, Image, TouchableWithoutFeedback, ScrollView, ListView, TouchableOpacity, RefreshControl
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import moment from 'moment'
import FONT from '../../utils/util.textSize'
import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { application, booking } from '../../redux/actions'
import UserList from './components/user.list'
import UserDetail from './components/user.detail'
import UserHeader from './components/user.header'
const { height, width } = Screen.window
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
export default connect(() => ({}))(class DownLineDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '二级列表',
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
        '_id': '5a697a7333f82544619072dd',
        'fullName': 'Test User 1.1',
        'avatars': [
          {
            'url': 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'
          }
        ],
        'referral': {
          '_id': '5a4a36d9812d94d4dadf6f43',
          'userId': 'AA-1234567',
          'fullName': 'Test User 1',
          'avatars': [
            {
              'url': 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'
            }
          ]
        },
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
        ],
        'joinedOn': '25 Jan 2018',
        'level': 1,
        'totalDownline': 2,
        'userId': 'NS-4352533',
        'phoneCountryCode': '+60',
        'phoneNo': '11000000'
      }
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
      //获取列表
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
          <UserHeader data={data} />
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
          <View style={{ backgroundColor: '#fff' }}>
            <UserDetail data={data} />
          </View>
          {
            data.users && data.users.length > 0 ?
              <View style={{ backgroundColor: '#f7f7f7',flex:1 }}>
                <UserList users={data.users} goUserDetails={(_id) => this.goUserDetails(_id)} />
              </View> : null
          }

        </ScrollView>
      </View>
    )
  }
})

