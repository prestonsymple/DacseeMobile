import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl, Platform, ScrollView
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import _ from 'lodash'

import { application, booking } from '../../../redux/actions'
import { Icons, Screen, Define, Session } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ account: state.account, booking: state.booking }))(class FriendsCircleComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS')}
        >
          {Icons.Generator.Material('add', 28, '#2f2f2f', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      title: '朋友圈'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRowsAndSections([[], []]),
      source: [[], []],
      loading: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd'))
    this.fetchData()
  }

  componentWillReceiveProps(props) {
    const { selected_friends } = props.booking

    if (selected_friends && selected_friends !== this.props.booking.selected_friends) {
      const clone = _.cloneDeep(this.state.source)
      clone[1] = clone[1].map(pipe => Object.assign({}, pipe, {
        checked: selected_friends.find(sub => sub._id === pipe._id) !== undefined
      }))
      this.setState({ dataSource: dataContrast.cloneWithRowsAndSections(clone) })
    }
  }

  async fetchData(index = 0) {
    const { selected_friends } = this.props.booking

    this.setState({ loading: true })
    try {
      const circleResp = await Promise.all([
        Session.circle.get('v1/requests?skip=0&limit=30'),
        Session.circle.get(`v1/circle?skip=${index}&limit=30`)
      ])
      const circleData = circleResp.map(pipe => pipe.data)
      circleData[1] = circleData[1].map(pipe => Object.assign({}, pipe, {
        checked: selected_friends.find(sub => sub._id === pipe._id) !== undefined
      }))
      this.setState({ dataSource: dataContrast.cloneWithRowsAndSections(circleData), source: circleData })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  render() {
    const { dataSource, loading, source } = this.state
    const { selected_friends } = this.props.booking

    return (
      <View style={{ flex: 1 }}>
        <HeaderSearchBar />
        {
          (dataSource.rowIdentities[0].length === 0 && dataSource.rowIdentities[1].length === 0) ? (
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.fetchData.bind(this)}
                title={'下拉进行刷新'}
                colors={['#ffffff']}
                progressBackgroundColor={'#1c99fb'}
              />
            } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: Screen.safaContent.height - 48 }} style={{ flex: 1 }}>
              <Text style={{ top: -64, color: '#777', fontSize: 15, fontWeight: '400' }}>暂无好友，点击右侧按钮进行添加</Text>
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              <ListView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.loading}
                    onRefresh={this.fetchData.bind(this)}
                    title={'下拉进行刷新'}
                    colors={['#ffffff']}
                    progressBackgroundColor={'#1c99fb'}
                  />
                }
                enableEmptySections={true}
                dataSource={dataSource}
                renderSectionHeader={(data, section) => {
                  return (data.length > 0) && (
                    <View style={{ paddingTop: 12, paddingBottom: 6, paddingLeft: 6, backgroundColor: '#F8F8F8' }}>
                      <Text style={{ fontSize: 11, color: '#999', fontWeight: '200' }}>{ section === '0' ? '好友请求' : '好友列表' }</Text>
                    </View>
                  )
                }}
                renderRow={(data, section, rowId) => 
                  section === '0' ? 
                    (<RequestorPerson 
                      onPressAccept={async (requestor_id) => {
                        try {
                          const data = await Session.circle.put(`v1/requests/${requestor_id}`, { action: 'accept' })
                        } catch (e) {
                          this.props.dispatch(application.showMessage('遇到错误，请稍后再试'))
                        } finally {
                          this.fetchData()
                        }
                      }} 
                      onPressReject={async (requestor_id) => {
                        try {
                          const data = await Session.circle.put(`v1/requests/${requestor_id}`, { action: 'reject' })
                        } catch (e) {
                          this.props.dispatch(application.showMessage('遇到错误，请稍后再试'))
                        } finally {
                          this.fetchData()
                        }
                      }} 
                      data={data} />) : 
                    (<ItemPerson 
                      data={data}
                      onPressCheck={() => {
                        let clone = _.cloneDeep(selected_friends)
                        if (clone.find(pipe => pipe._id === data._id)) {
                          clone = clone.filter(pipe => pipe._id !== data._id)
                        } else {
                          clone.push(data)
                        }
                        console.log(clone)
                        this.props.dispatch(booking.journeyUpdateData({ selected_friends: clone }))
                      }}
                      onPressDetail={() => this.props.navigation.navigate('FriendsDetail', { ...data })}
                    />)
                }
                renderSeparator={() => (
                  <View style={{ height: 1, backgroundColor: '#f2f2f2' }} />
                )}
              />
              <TouchableOpacity onPress={() => {
                if (selected_friends.length === 0) return this.props.dispatch(application.showMessage('请选择至少一个朋友'))
                this.props.navigation.goBack()
              }} activeOpacity={.7} style={[
                { height: Define.system.ios.x ? 68 : 44, paddingBottom: Define.system.ios.x ? 22 : 0 },
                { backgroundColor: selected_friends.length === 0 ? '#ccc' : '#70c040', justifyContent: 'center', alignItems: 'center' }
              ]}>
                <Text style={{ fontSize: 18, fontWeight: '400', color: 'white' }}>确认选择</Text>
              </TouchableOpacity>
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
      <View style={{ height: 48, width, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginHorizontal: 15, paddingHorizontal: 15, backgroundColor: 'white', borderRadius: 17, alignItems: 'center' }}>
          <TextInput {...Define.TextInputArgs} placeholder={'请输入姓名快速查询'} style={
            Platform.select({
              android: { height: 38, width: width - 45 },
              ios: { height: 34, width: width - 45 }
            })} />
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
      <TouchableOpacity activeOpacity={.7} onPress={() => onPressDetail()} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: avatars[0].url }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 2 }}>{fullName}</Text>
          <Text style={{ fontSize: 13, color: '#999' }}>{userId}</Text>
        </View>
        <TouchableOpacity onPress={() => onPressCheck()} activeOpacity={.8} style={{ height: 48, justifyContent: 'center', width: 48, alignItems: 'flex-end', paddingRight: 5 }}>
          { checked ? Icons.Generator.Material('check-circle', 24, '#70c040') : Icons.Generator.Material('check-circle', 24, '#999') }
        </TouchableOpacity>
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
      <View activeOpacity={.7} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: avatars[0].url }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 2 }}>{ fullName }</Text>
          <Text style={{ fontSize: 13, color: '#999' }}>{ userId }</Text>
        </View>
        <View style={{ marginRight: 0, width: 80, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => onPressAccept(_id)} activeOpacity={.7} style={{ width: 32, height: 32, borderRadius: 18, borderColor: '#70c040', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('check', 18, '#70c040') }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressReject(_id)} activeOpacity={.7} style={{ width: 32, height: 32, borderRadius: 18, borderColor: '#e43c39', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('close', 18, '#e43c39') }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}