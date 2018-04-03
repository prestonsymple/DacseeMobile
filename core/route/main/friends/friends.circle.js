import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl, Platform, ScrollView
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import _ from 'lodash'

import { application, booking, circle } from '../../../redux/actions'
import { Icons, Screen, Define, Session,TextFont } from '../../../utils'
import { FormattedMessage, injectIntl } from 'react-intl';

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  account: state.account,
  booking: state.booking,
  ...state.circle,
  i18n: state.intl.messages || {}
}))(class FriendsCircleComponent extends PureComponent {

  static navigationOptions = ({ navigation }) => {
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
      title: '朋友圈'
    }
  }

  constructor(props) {
    super(props)

    const { selected_friends } = props.booking
    const _friend = props.friend.map(pipe => Object.assign({}, pipe, {
      checked: typeof(selected_friends) === 'string' ? false : selected_friends.find(sub => sub._id === pipe._id) !== undefined
    }))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      props.requestor,
      _friend
    ])

    this.state = {
      dataSource: _dataSource,
      selected: selected_friends
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd'))
  }

  componentWillReceiveProps(props) {
    if (this.props.friend !== props.friend || this.props.requestor !== props.requestor) {
      const { selected_friends } = props.booking
      const _friend = props.friend.map(pipe => Object.assign({}, pipe, {
        checked: (this.state.selected.find(sub => sub._id === pipe._id) !== undefined)
      }))
      const _dataSource = dataContrast.cloneWithRowsAndSections([
        props.requestor,
        _friend
      ])
      this.setState({ dataSource: _dataSource })
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  onPressCheck(data) {
    const { selected } = this.state

    let clone = _.cloneDeep(selected)
    if (clone.find(pipe => pipe._id === data._id)) {
      clone = clone.filter(pipe => pipe._id !== data._id)
    } else {
      clone.push(data)
    }

    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: clone.find(sub => sub._id === pipe._id) !== undefined
    }))
    if (_friend.length >= 20) return this.props.dispatch(application.showMessage('最多只能选择20个朋友'))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected: clone })
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

  render() {
    const { dataSource, selected } = this.state
    const { loading, i18n } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <HeaderSearchBar />
        {
          (dataSource.rowIdentities[0].length === 0 && dataSource.rowIdentities[1].length === 0) ? (
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => this.props.dispatch(circle.asyncFetchFriends({ init: true }))}
                title={'下拉进行刷新'}
                colors={['#ffffff']}
                progressBackgroundColor={'#1c99fb'}
              />
            } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{ flex: 1 }}>
              <View style={{ marginTop: 108 }}>
                <Image style={{ marginBottom: 18 }} source={require('../../../resources/images/friend-empty-state.png')} />
                <Text style={{ color: '#666', fontSize: TextFont.TextSize(22), fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>
                  <FormattedMessage id={'no_friend'}/>
                </Text>
                <Text style={{ color: '#999', fontSize: TextFont.TextSize(15), fontWeight: '400', textAlign: 'center' }}>
                  <FormattedMessage id={'clickto_add_friend'}/>
                </Text>
              </View>
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              <ListView
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => this.props.dispatch(circle.asyncFetchFriends({ init: true }))}
                    title={'下拉进行刷新'}
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
                    <View style={{ height: 34, justifyContent: 'center', paddingTop: 16, backgroundColor: 'white' }}>
                      <Text style={{ fontSize: TextFont.TextSize(12), color: '#8c8c8c', fontWeight: '600' }}>{ section === '0' ? i18n.friend_waitfor_accept : i18n.friend_my }</Text>
                    </View>
                  )
                }}
                renderRow={(data, section, rowId) =>
                  section === '0' ?
                    (<RequestorPerson
                      onPressAccept={async (requestor_id) => {
                        try {
                          const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'accept' })
                        } catch (e) {
                          this.props.dispatch(application.showMessage('遇到错误，请稍后再试'))
                        } finally {
                          this.props.dispatch(circle.asyncFetchFriends({ init: true }))
                        }
                      }}
                      onPressReject={async (requestor_id) => {
                        try {
                          const data = await Session.Circle.Put(`v1/requests/${requestor_id}`, { action: 'reject' })
                        } catch (e) {
                          this.props.dispatch(application.showMessage('遇到错误，请稍后再试'))
                        } finally {
                          this.props.dispatch(circle.asyncFetchFriends({ init: true }))
                        }
                      }}
                      data={data} />) :
                    (<ItemPerson
                      data={data}
                      onPressCheck={() => this.onPressCheck(data)}
                      onPressDetail={() => this.props.navigation.navigate('FriendsDetail', { ...data })}
                    />)
                }
                renderSeparator={() => (
                  <View style={{ height: .8, backgroundColor: '#e8e8e8' }} />
                )}
              />
              {
                (selected.length === 0) && (
                  <TouchableOpacity onPress={() => this.onPressCheckAll()} activeOpacity={.7} style={[
                    { height: 56, bottom: Define.system.ios.x ? 27 + 22 : 27 },
                    { width: width - 90, left: 45, borderRadius: 33 },
                    { backgroundColor: '#FFB639', justifyContent: 'center', alignItems: 'center' }
                  ]}>
                    <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: '400', color: 'white' }}>
                      <FormattedMessage id={'select_all'}/>
                    </Text>
                  </TouchableOpacity>
                )
              }
              {
                (selected.length !== 0) && (
                  <TouchableOpacity onPress={() => {
                    this.props.dispatch(booking.passengerSetValue({ selected_friends: selected }))
                    this.props.navigation.goBack()
                  }} activeOpacity={.7} style={[
                    { height: 56, bottom: Define.system.ios.x ? 27 + 22 : 27 },
                    { width: width - 90, left: 45, borderRadius: 33 },
                    { backgroundColor: '#FFB639', justifyContent: 'center', alignItems: 'center' }
                  ]}>
                    <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: '400', color: 'white' }}>
                      <FormattedMessage id={'confirm'}/>
                    </Text>
                  </TouchableOpacity>
                )
              }
            </View>
          )
        }
      </View>
    )
  }
})

class HeaderSearchBar extends Component {
  render() {
    return (
      <View style={{ height: 62, width, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginHorizontal: 10, width: width - 20, paddingHorizontal: 18, backgroundColor: '#1697d7', borderRadius: 21, alignItems: 'center' }}>
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
    )
  }
}

class ItemPerson extends Component {
  render() {
    const { onPressDetail = () => {}, onPressCheck = () => {}, data } = this.props
    const { _id, friend_id, friend_info, checked } = data
    const { avatars, email, fullName, phoneCountryCode, phoneNo, userId } = friend_info

    return (
      <TouchableOpacity onPress={() => onPressDetail()} activeOpacity={.7} style={{ height: 84, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ justifyContent: 'center', marginRight: 10 }}>
          <Image style={{ width: 56, height: 56, borderRadius: 28 }} source={{ uri: avatars[avatars.length - 1].url }} />
          <View style={{ right: 2, bottom: 2, position: 'absolute', backgroundColor: '#7ED321', width: 12, height: 12, borderRadius: 6 }}></View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400', marginBottom: 5 }}>{fullName}</Text>
          <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>0次行程</Text>
        </View>
        {
          checked ? (
            <TouchableOpacity onPress={() => onPressCheck()} activeOpacity={.7} style={{ width: 30, height: 30, borderRadius: 18, backgroundColor: '#7ed321', justifyContent: 'center', alignItems: 'center' }}>
              { Icons.Generator.Material('check', 18, 'white') }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onPressCheck()} activeOpacity={.7} style={{ width: 30, height: 30, borderRadius: 18, backgroundColor: '#e7e7e7', justifyContent: 'center', alignItems: 'center' }}>
            </TouchableOpacity>
          )
        }
      </TouchableOpacity>
    )
  }
}

class RequestorPerson extends Component {
  render() {
    const { onPressAccept = () => {}, onPressReject = () => {}, data } = this.props
    const { _id, requestor_id, requestor_info } = data
    const { avatars, email, fullName, phoneCountryCode, phoneNo, userId } = requestor_info

    return (
      <View activeOpacity={.7} style={{ height: 84, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ justifyContent: 'center', marginRight: 10 }}>
          <Image style={{ width: 56, height: 56, borderRadius: 28 }} source={{ uri: avatars[avatars.length - 1].url }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400', marginBottom: 5 }}>{ fullName }</Text>
          <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>0次行程</Text>
        </View>
        <View style={{ marginRight: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => onPressReject(_id)} activeOpacity={.7} style={{ marginRight: 15, width: 30, height: 30, borderRadius: 18, backgroundColor: '#eb8d97', justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('close', 18, 'white') }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressAccept(_id)} activeOpacity={.7} style={{ width: 30, height: 30, borderRadius: 18, backgroundColor: '#ace36f', justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('check', 18, 'white') }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
