/**
 * Created by Rabbit on 2018/4/11.
 */

import React, { Component, PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableWithoutFeedback, RefreshControl, ListView,
  InteractionManager, ScrollView, TextInput, TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import _ from 'lodash'
import { Define, Screen, Session, Icons, TextFont } from '../../../utils'
import { connect } from 'react-redux'
import FriendCell from './components/friend.cell'
import FriendRequest from './components/friend.request'
const { width, height } = Screen.window
import { application, booking, circle } from '../../../redux/actions'
import { FormattedMessage } from 'react-intl'
import { NavigationActions } from 'react-navigation'
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  account: state.account,
  booking: state.booking,
  ...state.circle,
  i18n: state.intl.messages || {}
}))(class GroupFriends extends Component {
  constructor(props) {
    super(props)
    const { selected_friends } = props.booking
    const _friend = props.friend.map(pipe => Object.assign({}, pipe, {
      checked: typeof (selected_friends) === 'string' ? false : selected_friends.find(sub => sub._id === pipe._id) !== undefined
    }))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      props.requestor,
      _friend
    ])

    this.state = {
      dataSource: _dataSource,
      selected: selected_friends,
      selectedAll: false,
    }
  }

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS')}
        >
          {Icons.Generator.Material('add', 28, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      title: reducer.intl.messages.mycircle,
    }
  }

  async componentDidMount() {
    const { i18n } = this.props
    const { mycircle } = i18n
    const { setParams } = this.props.navigation
    setParams({ mycircle })
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd', { i18n }))
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('FRIENDS.SWITCHER.EMITTER', 1)
    this.subscription && this.subscription.remove()
  }
  onPressCheck(data) {
    const { selected, selectAll } = this.state
    let clone = _.cloneDeep(selected)
    let nextSelect = !clone.find(pipe => pipe._id === data._id)
    let nextSelectAll = selectAll
    if (nextSelect) {
      clone.push(data)
      //全部选中则全选按钮高亮
      nextSelectAll = (clone.length === this.props.friend.length) && (!nextSelectAll) ? true : false
    } else {
      clone = clone.filter(pipe => pipe._id !== data._id)
      //全选按钮 变灰
      nextSelectAll = nextSelectAll ? false : nextSelectAll
    }
    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: clone.find(sub => sub._id === pipe._id) !== undefined
    }))
    if (_friend.length >= 20) return this.props.dispatch(application.showMessage(this.props.i18n.max_twenty_friends))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected: clone, selectAll: nextSelectAll })
  }

  onPressCheckAll() {
    const _selected = this.props.friend
    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: true
    }))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected: _selected })
  }
  _handleClick = () => {
    const { selected } = this.state
    this.props.dispatch(booking.passengerSetValue({ selected_friends: selected }))
    this.props.navigation.goBack()
  }
  selectAllGroup = () => {
    const _selected = this.props.friend
    const { selectAll } = this.state
    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: !selectAll
    }))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected: (!selectAll ? _selected : []), selectAll: !selectAll })
  }

  render() {
    const { dataSource, selected, selectAll } = this.state
    const { loading, i18n } = this.props
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ height: 62, backgroundColor: '#1ab2fd' }}>
            <View style={{ marginHorizontal: 10, width: width - 20, paddingHorizontal: 18, marginTop: 10, backgroundColor: '#1697d7', borderRadius: 21, alignItems: 'center' }}>
              <FormattedMessage id={'search_name_phone_email'}>
                {
                  msg => (
                    <TextInput {...Define.TextInputArgs} placeholderTextColor={'#FFFFFF66'} placeholder={msg} style={
                      Platform.select({
                        android: { height: 42, width: width - 56 },
                        ios: { height: 42, width: width - 56 }
                      })} />
                  )
                }
              </FormattedMessage>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <ListView
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => this.props.dispatch(circle.asyncFetchFriends({ init: true }))}
                  title={i18n.pull_refresh}
                  colors={['#ffffff']}
                  progressBackgroundColor={'#1c99fb'}
                />
              }
              contentContainerStyle={{
                paddingHorizontal: 25
              }}
              enableEmptySections={true}
              dataSource={dataSource}
              renderSectionHeader={(data, section) => {
                return (data.length > 0) && (
                  <View style={{}}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15, flexDirection: 'row' }}>
                      <Image style={{ width: 56, height: 56, borderRadius: 28 }} source={{ uri: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }} />
                      <Text style={{ fontSize: TextFont.TextSize(16), marginLeft: 10, color: '#000' }}>我的家庭</Text>
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between' }}>
                      <View style={{ height: 34, justifyContent: 'center', paddingTop: 16, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: TextFont.TextSize(14), color: '#8c8c8c', fontWeight: '600' }}>{section === '0' ? i18n.friend_waitfor_accept : i18n.friend_my}</Text>
                      </View>
                      {section !== '0' ?
                        <TouchableOpacity onPress={this.selectAllGroup} hitSlop={{ top: 27, left: 40, bottom: 27, right: 0 }} activeOpacity={.7} style={[styles.circle, { backgroundColor: selectAll ? '#7ed321' : '#e7e7e7' }]}>
                          {selectAll ? Icons.Generator.Material('check', 18, 'white') : null}
                        </TouchableOpacity>
                        : null
                      }

                    </View>
                  </View>
                )
              }}
              renderFooter={() => ((dataSource.rowIdentities[0].length === 0 && dataSource.rowIdentities[1].length === 0) ?
                <TouchableWithoutFeedback>
                  <View style={{ marginTop: 108, alignItems: 'center', }}>
                    <Image style={{ marginBottom: 18 }} source={require('../../../resources/images/friend-empty-state.png')} />
                    <Text style={{ color: '#666', fontSize: TextFont.TextSize(22), fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>
                      <FormattedMessage id={'no_friend'} />
                    </Text>
                    <Text style={{ color: '#999', fontSize: TextFont.TextSize(15), fontWeight: '400', textAlign: 'center' }}>
                      <FormattedMessage id={'clickto_add_friend'} />
                    </Text>
                  </View></TouchableWithoutFeedback> : null
              )}
              renderRow={(data, section, rowId) =>
                section === '0' ?
                  (<FriendRequest
                    onPressAccept={async (requestor_id) => {
                      try {
                        const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'accept' })
                      } catch (e) {
                        this.props.dispatch(application.showMessage(i18n.error_try_again))
                      } finally {
                        this.props.dispatch(circle.asyncFetchFriends({ init: true }))
                      }
                    }}
                    onPressReject={async (requestor_id) => {
                      try {
                        const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'reject' })
                      } catch (e) {
                        this.props.dispatch(application.showMessage(i18n.error_try_again))
                      } finally {
                        this.props.dispatch(circle.asyncFetchFriends({ init: true }))
                      }
                    }}
                    data={data} />) :
                  (<FriendCell
                    data={data}
                    onPressCheck={() => this.onPressCheck(data)}
                    onPressDetail={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsDetail', params: { i18n, ...data } }))}
                  />)
              }
              renderSeparator={() => (
                <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
              )}
            />
          </View>
        </View>
      </View>
    )
  }
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: Define.system.ios.x ? 110 : 78,
    width: width
  }
})
