import React, { PureComponent, Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ListView,
  TextInput,
  Image,
  RefreshControl,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import _ from 'lodash'
import { NavigationActions } from 'react-navigation'
import GroupCell from './components/group.cell'
import FriendRequest from './components/friend.request'
import GroupRequest from './components/group.request'

import NavigatorBarSwitcher from '../components/navigator.bar.switcher'


import { application, booking, circle } from '../../../redux/actions'
import {Icons, Screen, Define, Session, TextFont, System} from '../../../utils'
import { FormattedMessage, injectIntl } from 'react-intl'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  account: state.account,
  booking: state.booking,
  ...state.circle,
  i18n: state.intl.messages || {}
}))(class FriendsGroupList extends PureComponent {
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
      selected: selected_friends,
      selectAll:false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    // this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd',{i18n}))
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

  onPressCheck(data) {
    const { selected ,selectAll} = this.state
    let clone = _.cloneDeep(selected)
    let nextSelect = !clone.find(pipe => pipe._id === data._id)
    let nextSelectAll = selectAll
    if (nextSelect) {
      clone.push(data)
      //全部选中则全选按钮高亮
      nextSelectAll=(clone.length===this.props.friend.length)&&(!nextSelectAll)?true:false
    } else {
      clone = clone.filter(pipe => pipe._id !== data._id)
      //全选按钮 变灰
      nextSelectAll=nextSelectAll?false:nextSelectAll
    }
    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: clone.find(sub => sub._id === pipe._id) !== undefined
    }))
    if (_friend.length >= 20) return this.props.dispatch(application.showMessage(this.props.i18n.max_twenty_friends))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected: clone,selectAll:nextSelectAll })
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
  _handleClick=()=>{
    const {  selected } = this.state
    this.props.dispatch(booking.passengerSetValue({ selected_friends: selected }))
    this.props.navigation.goBack()
  }
  selectAllGroup = () => {
    const _selected = this.props.friend
    const {selectAll}=this.state
    const _friend = this.props.friend.map(pipe => Object.assign({}, pipe, {
      checked: !selectAll
    }))
    const _dataSource = dataContrast.cloneWithRowsAndSections([
      this.props.requestor,
      _friend
    ])
    this.setState({ dataSource: _dataSource, selected:( !selectAll?_selected:[]) ,selectAll:!selectAll})
  }

  _refreshControl = (loading, i18n) => (
    <RefreshControl
      refreshing={loading}
      onRefresh={() => this.props.dispatch(circle.asyncFetchFriends({ init: true }))}
      title={i18n.pull_refresh}
      colors={['#ffffff']}
      progressBackgroundColor={'#1c99fb'}
    />
  )

  // @TODO 分组名称国际化
  _renderSectionHeader(data, section) {
    const { i18n } = this.props
    const { _id, friend_id, friend_info, checked } = data
    const { selectAll } = this.state

    return (data.length > 0) && (
      <View>
        <View style={{ height: 34,flexDirection:'row', justifyContent: 'space-between', backgroundColor: 'white' }}>
          <View style={{marginTop: 16}}>
            <Text style={{ fontSize: TextFont.TextSize(12), color: '#8c8c8c', fontWeight: '600' }}>{ section === '0' ? i18n.friend_waitfor_accept : i18n.friend_my }</Text>
          </View>
          {section !== '0' ?
            <TouchableOpacity onPress={()=>this.selectAllGroup(data, section)} hitSlop={{top: 27, left: 40, bottom: 27, right: 0}} activeOpacity={.7} style={[styles.circle,{backgroundColor:selectAll?'#7ed321':'#e7e7e7', marginTop:13}]}>
              { selectAll ?Icons.Generator.Material('check', 18, 'white'):null }
            </TouchableOpacity>
            :
            null
          }
        </View>
      </View>
    )
  }

  _renderFooter = () => {
    const { dataSource, selected } = this.state
    return(
      dataSource.rowIdentities[0].length === 0 && dataSource.rowIdentities[1].length === 0 ?
        <TouchableWithoutFeedback>
          <View style={{ marginTop: 108,alignItems:'center',}}>
            <Image style={{ marginBottom: 18 }} source={require('../../../resources/images/friend-empty-state.png')} />
            <Text style={{ color: '#666', fontSize: TextFont.TextSize(22), fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>
              <FormattedMessage id={'no_friend'}/>
            </Text>
            <Text style={{ color: '#999', fontSize: TextFont.TextSize(15), fontWeight: '400', textAlign: 'center' }}>
              <FormattedMessage id={'clickto_add_friend'}/>
            </Text>
          </View>
        </TouchableWithoutFeedback> : null
    )
  }

  _renderRow = (data, section, rowId) => {
    const { loading, i18n } = this.props
    return(
      section === '0' ?
        (<GroupRequest
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
        (<GroupCell
          data={data}
          onPressCheck={() => this.onPressCheck(data)}
          onPressDetail={()=> this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsGroupDetail', params: { i18n,...data } }))}
        />)
    )
  }

  render() {
    const { dataSource, selected ,selectAll} = this.state
    const { loading, i18n } = this.props
    return (
      <View style={{backgroundColor:'white'}}>
        <View style={{flex:1, backgroundColor:'white'}}>
          <HeaderSearchBar />
          <ListView
            refreshControl={this._refreshControl(loading, i18n)}
            contentContainerStyle={{ paddingHorizontal: 25 }}
            enableEmptySections={true}
            dataSource={dataSource}
            renderSectionHeader={this._renderSectionHeader.bind(this)}
            renderFooter={this._renderFooter.bind(this)}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={() => (<View style={{ height: .8, backgroundColor: '#e8e8e8' }} />)}
          />
        </View>
        {(dataSource.rowIdentities[0].length === 0 && dataSource.rowIdentities[1].length === 0)?
          null: <View style={styles.bottomButton}>
            <TouchableOpacity onPress={() => this._handleClick()} activeOpacity={.7} style={styles.confirmButton}>
              <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: '400', color: 'white' }}>
                <FormattedMessage id={'confirm'}/>
              </Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
})

class HeaderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switcherStatus: 0
    };
  }
  render() {
    return (
      <View style={{paddingVertical: 10, backgroundColor: '#1ab2fd'}}>
        <View style={{ marginHorizontal: 10, width: width - 20, paddingHorizontal: 18, backgroundColor: '#0d618a', borderRadius: 21, alignItems: 'center' }}>
          <FormattedMessage id={'search_name_phone_email'}>
            {
              msg => (
                <TextInput {...Define.TextInputArgs} placeholderTextColor={'#FFFFFF66'} placeholder={msg} style={
                  Platform.select({
                    android: { height: 72, width: width - 56 },
                    ios: { height: 36, width: width - 56 }
                  })} />
              )
            }
          </FormattedMessage>
        </View>
      </View>
    )
  }
}


const styles=StyleSheet.create({
  circle:{
    width: 23,
    height: 23,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomButton:{
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    height:Define.system.ios.x ?110:78,
    width: width - 90,
    marginHorizontal: 45,
  },
  confirmButton:{
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 90,
    height: 60,
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
