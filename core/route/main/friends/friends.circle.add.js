/* global store */

import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl, Alert
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'

import { } from '../../../redux/actions'
import { Icons, Screen } from '../../../utils'
import ShareUtil from '../../../native/umeng/ShareUtil'
import { application } from '../../../redux/actions'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ account: state.account }))(class FriendsCircleAddComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '添加好友'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([
        { describer: '使用电话号码进行搜索', onPress: () => {

        }, label: '电话号码', icon: Icons.Generator.Awesome('phone', 36, '#666', { style: { left: 5 } }) },
        { describer: '使用邮箱/用户账号进行搜索', onPress: () => {
          
        }, label: '邮箱/用户账号', icon: Icons.Generator.Awesome('envelope', 36, '#666', { style: { left: 2 } }) },
        { describer: '通过微信邀请好友', onPress: () => this.ActionSheet.show(), label: '微信', icon: Icons.Generator.Awesome('weixin', 36, '#666', { style: { left: 0 } }) },
        { describer: '分享邀请链接到微博', onPress: () => this.props.dispatch(application.showMessage('微博授权获取失败')), label: '微博', icon: Icons.Generator.Awesome('weibo', 36, '#666', { style: { left: 1.5 } }) },
        // { describer: '从Facebook好友列表中查找', label: 'Facebook', icon: Icons.Generator.Awesome('facebook', 36, '#333', { style: { left: 8 } }) }
      ])
    }
  }

  async componentDidMount() {
    
  }

  async _pressActionSheet(index) {
    if (index === 0) {
      await ShareUtil.share(
        '分享至微信', 
        'http://firicon.fir.im/77b53eac1af234a4aca786fd86e615208bacc0d9?e=1520125806&token=LOvmia8oXF4xnLh0IdH05XMYpH6ENHNpARlmPc-T:6DhdIraIBadFnepnbf4__RxZz7A=', 
        `http://47.98.40.59/?referrer=${this.props.account.user.userId}&id=${this.props.account.user._id}`, 
        '加入DACSEE', 
        3, 
        (arg) => { console.log(arg) }
      )
    } else if (index === 1) {
      await ShareUtil.share(
        '分享至微信', 
        'http://firicon.fir.im/77b53eac1af234a4aca786fd86e615208bacc0d9?e=1520125806&token=LOvmia8oXF4xnLh0IdH05XMYpH6ENHNpARlmPc-T:6DhdIraIBadFnepnbf4__RxZz7A=', 
        `http://47.98.40.59/?referrer=${this.props.account.user.userId}&id=${this.props.account.user._id}`, 
        '加入DACSEE', 
        2, 
        (arg) => { console.log(arg) }
      )
    }
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ListView
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={(data) => <ItemPerson data={data} />}
          renderSeparator={() => (
            <View style={{ height: 1, backgroundColor: '#f2f2f2' }} />
          )}
        />
        <ActionSheet
          ref={e => this.ActionSheet = e}
          title={'分享到微信'}
          options={['朋友圈', '好友', '取消']}
          cancelButtonIndex={2}
          // destructiveButtonIndex={0}
          onPress={this._pressActionSheet.bind(this)}
        />
      </View>
    )
  }
})

class ItemPerson extends Component {
  render() {
    const { icon, label, describer, onPress = () => {} } = this.props.data
    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 2 }}>{ label }</Text>
          <Text style={{ fontSize: 13, color: '#999' }}>{ describer }</Text>
        </View>
      </TouchableOpacity>
    )
  }
}