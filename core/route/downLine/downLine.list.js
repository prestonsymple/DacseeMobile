import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableWithoutFeedback, TouchableOpacity,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import moment from 'moment'
import { Screen, Icons, Redux, Define, System, Session,TextFont } from '../../utils'

import { application, booking } from '../../redux/actions'
import UserList from './components/user.list'
import { FormattedMessage } from 'react-intl';
const { height, width } = Screen.window
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class DownLineListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.downline_list,
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
      data: { users: [] },
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
    const { state } = this.props.navigation
    const { params, i18n } = state
    try {
      const data = await Session.User.Get(`v1/downline/level/${params.level}`)
      this.setState({
        loading: false,
        data: data
      })
    } catch (e) {
      this.props.dispatch(application.showMessage(i18n.unable_connect_server_pls_retry_later))
      this.setState({
        loading: false
      })
    }
  }
  goUserDetails(_id) {
    const {i18n} = this.props
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'DownLineDetail',
      params: {
        _id: _id,
        level: this.state.data.level,
        i18n
      }
    }))
  }
  render() {
    const { i18n } = this.props
    const { data } = this.state
    const { state } = this.props.navigation
    const { params } = state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ backgroundColor: '#1AB2FD', paddingHorizontal: 20 }}>
          <FormattedMessage id={'level'}>
            {
              msg => (
                <Text style={{ fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: '#fff', paddingBottom: 15 }}>
                  {`${msg} ${params.level}`}</Text>
              )
            }
          </FormattedMessage>
          <Text style={{ fontSize: TextFont.TextSize(15), color: '#fff', marginBottom: 5 }}>{i18n.total_downline}</Text>
          <Text style={{ fontSize: TextFont.TextSize(25), fontWeight: 'bold', color: '#fff', marginBottom: 15 }}>{data.users.length}</Text>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._fetchData.bind(this)}
            title={i18n.pull_refresh}
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


