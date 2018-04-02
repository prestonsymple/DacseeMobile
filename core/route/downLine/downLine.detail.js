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
      title: 'DOWNLINE DETAILS',
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
      data: { users: [], referral: {} }
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
      const { state } = this.props.navigation
      const { params } = state
      const data = await Session.User.Get('v1/downline/user/' + params._id)
      // if(params.level==2){
      //   data.users=[]
      // }
      this.setState({
        loading: false,
        data: data
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
      params: {
        _id: _id,
        level: this.state.data.level
      }
    }))
  }
  render() {
    const { data } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: data.users && data.users.length > 0 ?'#f7f7f7':'#fff' }}>
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
              <View style={{ backgroundColor: '#f7f7f7', flex: 1 }}>
                <UserList users={data.users} goUserDetails={(_id) => this.goUserDetails(_id)} />
              </View> : null
          }
        </ScrollView>
      </View>
    )
  }
})

