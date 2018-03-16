/* global store */

import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ScrollView, TextInput, Image, RefreshControl, Alert, TouchableNativeFeedback
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'

import { } from '../../../redux/actions'
import { Icons, Screen, Define, System } from '../../../utils'
import ShareUtil from '../../../native/umeng/ShareUtil'
import { application } from '../../../redux/actions'

const { width, height } = Screen.window

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
      // dataSource: dataContrast.cloneWithRows([
      //   { describer: '使用电话号码进行搜索', label: '电话号码', icon: Icons.Generator.Awesome('phone', 36, '#666', { style: { left: 5 } }) },
      //   { describer: '使用邮箱/用户账号进行搜索', label: '邮箱/用户账号', icon: Icons.Generator.Awesome('envelope', 36, '#666', { style: { left: 2 } }) },
      //   { describer: '通过微信邀请好友', onPress: () => this.ActionSheet.show(), label: '微信', icon: Icons.Generator.Awesome('weixin', 36, '#666', { style: { left: 0 } }) },
      //   { describer: '分享邀请链接到微博', onPress: () => this.props.dispatch(application.showMessage('微博授权获取失败')), label: '微博', icon: Icons.Generator.Awesome('weibo', 36, '#666', { style: { left: 1.5 } }) },
      //   // { describer: '从Facebook好友列表中查找', label: 'Facebook', icon: Icons.Generator.Awesome('facebook', 36, '#333', { style: { left: 8 } }) }
      // ])
    }
  }

  async componentDidMount() {
    
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingVertical: 22 }} style={{ flex: 1 }}>
          {/* PHONE NO. */}
          <BlockWrap 
            iconBackgroundColor={'#4fb2f9'} 
            icon={Icons.Generator.Awesome('phone', 36, 'white')} 
            title={'电话号码'}
            describer={'通过电话号码搜索'}
            isPhoneNo={true}
            placeholder={'13x xxxx xxxx'}
            canInput={true}
            navigation={this.props.navigation}
            onPress={(value, countryCode) => {
              if (value.length === 0) return this.props.dispatch(application.showMessage('请输入正确的手机号码'))
              this.props.navigation.navigate('FriendsSearchBase', { value, countryCode })
            }}
          />

          {/* EMAIL ADDRESS */}
          <BlockWrap 
            iconBackgroundColor={'#4f9029'} 
            icon={Icons.Generator.Awesome('envelope', 28, 'white')} 
            title={'邮箱'}
            describer={'通过注册邮箱搜索'}
            placeholder={'example@mail.com'}
            canInput={true}
            onPress={(value) => {
              if (value.length === 0 || !System.Rules.isMail(value)) return this.props.dispatch(application.showMessage('请输入正确的邮箱地址'))
              this.props.navigation.navigate('FriendsSearchBase', { value })
            }}
          />

          {/* PHONE NO. */}
          <BlockWrap 
            iconBackgroundColor={'#f4a951'} 
            icon={Icons.Generator.Awesome('address-card', 28, 'white')} 
            title={'姓名或用户账号'}
            describer={'通过姓名或用户账号进行搜索'}
            placeholder={''}
            canInput={true}
            navigation={this.props.navigation}
            onPress={(value) => {
              if (value.length < 2) return this.props.dispatch(application.showMessage('请输入至少2个字符'))
              this.props.navigation.navigate('FriendsSearchBase', { value })
            }}
          />

          {/* WECHAT SESSION */}
          <BlockWrap 
            iconBackgroundColor={'#f4a951'} 
            icon={Icons.Generator.Awesome('wechat', 28, 'white')} 
            title={'微信好友'}
            describer={'将邀请链接分享给好友'}
            onPress={async () => {
              await ShareUtil.share(
                '分享至微信', 
                'http://firicon.fir.im/77b53eac1af234a4aca786fd86e615208bacc0d9?e=1520125806&token=LOvmia8oXF4xnLh0IdH05XMYpH6ENHNpARlmPc-T:6DhdIraIBadFnepnbf4__RxZz7A=', 
                `http://47.98.40.59/?referrer=${this.props.account.user.userId}&id=${this.props.account.user._id}`, 
                '加入DACSEE', 
                2, 
                (arg) => { console.log(arg) }
              )
            }}
          />

          {/* WECHAT CIRCLE */}
          <BlockWrap 
            iconBackgroundColor={'#f4a951'} 
            icon={<Image source={require('../../../resources/images/wechat_moments.png')} />} 
            title={'微信朋友圈'}
            describer={'将邀请链接分享至朋友圈'}
            onPress={async () => {
              await ShareUtil.share(
                '分享至微信', 
                'http://firicon.fir.im/77b53eac1af234a4aca786fd86e615208bacc0d9?e=1520125806&token=LOvmia8oXF4xnLh0IdH05XMYpH6ENHNpARlmPc-T:6DhdIraIBadFnepnbf4__RxZz7A=', 
                `http://47.98.40.59/?referrer=${this.props.account.user.userId}&id=${this.props.account.user._id}`, 
                '加入DACSEE', 
                3, 
                (arg) => { console.log(arg) }
              )
            }}
          />

          {/* WECHAT CIRCLE */}
          <BlockWrap 
            iconBackgroundColor={'#f4a951'} 
            icon={Icons.Generator.Awesome('weibo', 32, 'white')} 
            title={'新浪微博'}
            describer={'将邀请链接分享至新浪微博'}
          />
        </ScrollView>
      </View>
    )
  }
})

class BlockWrap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      countryCode: '+86'
    }
  }

  render() {
    const { canInput, title, describer, iconBackgroundColor, icon, isPhoneNo, placeholder, onPress = () => {} } = this.props
    const { countryCode, value } = this.state
    const WrapComponent = canInput ? View : TouchableOpacity

    return (
      <WrapComponent activeOpacity={.7} onPress={() => onPress()} style={[
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .3, shadowRadius: 3 },
        { marginBottom: 15, height: 105, borderRadius: 17, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }
      ]}>
        <IconWrap backgroundColor={iconBackgroundColor}>{ icon }</IconWrap>
        <View style={{ justifyContent: 'center', marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 16, color: 'black', marginBottom: canInput ? 2 : 6 }}>{ title }</Text>
          <Text style={{ fontSize: 11, color: '#969696' }}>{ describer }</Text>
          { 
            canInput && (
              <View style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row', height: 36, borderRadius: 6, backgroundColor: '#e8e8e8', paddingHorizontal: 6, alignItems: 'center' }}>
                  {
                    isPhoneNo && (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('PublicPickerCountry', {
                        onPress: ({ name, code }) => this.setState({ countryCode: code })
                      })} activeOpacity={.7} style={[
                        { shadowOffset: { width: 0, height: 1 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                        { marginRight: 5, flexDirection: 'row', height: 26, borderRadius: 15, backgroundColor: '#3b90f7', width: 58, justifyContent: 'center', alignItems: 'center' }
                      ]}>
                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>{countryCode}</Text>
                        { Icons.Generator.Material('arrow-drop-down', 14, 'white') }
                      </TouchableOpacity>
                    )
                  }
                  <TextInput {...Define.TextInputArgs} onChangeText={ value => this.setState({ value: (value || '').trim() }) } keyboardType={isPhoneNo ? 'number-pad' : 'default'} placeholder={placeholder} style={{ flex: 1, fontSize: 13 }} />
                  <TouchableOpacity onPress={() => onPress(value, countryCode)} activeOpacity={.7} style={[
                    { shadowOffset: { width: 0, height: 1 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                    { backgroundColor: '#F5A623', width: 26, height: 26, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }
                  ]}>
                    { Icons.Generator.Material('search', 18, 'black') }
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </View>
      </WrapComponent>
    )
  }
}

class IconWrap extends Component {
  render() {
    return (
      <View style={[
        { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center' },
        { borderColor: '#EAEAEA', borderWidth: 6 },
        { backgroundColor: this.props.backgroundColor }
      ]}>
        { this.props.children }
      </View>
    )
  }
}

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