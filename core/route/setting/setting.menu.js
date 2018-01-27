import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, Image, ListView, Alert, Button } from 'react-native'
import InteractionManager from 'InteractionManager'
import lodash from 'lodash'
import moment from 'moment'
// import fs, { DocumentDirectoryPath } from 'react-native-fs'
import { connect } from 'react-redux'

/*****************************************************************************************************/
import {
  account,
  application
} from '../../redux/actions'
import { 
  Screen, Icons, Define
} from '../../utils'
/*****************************************************************************************************/

const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

const SETTING_ARGS = (props) => ({
  a: [{
    title: '账号与安全',
    onPress: () => Alert.alert('手机号码暂不支持更改')
  }],
  b: [{
    title: '新消息通知',
    onPress: () => {}
  }, {
    title: '通用',
    onPress: () => {}
  }],
  c: [{
    title: '意见反馈',
    onPress: async () => this.props.navigation.navigate('PublicFeedback')
  }, {
    title: '帮助中心',
    onPress: () => this.props.navigation.navigate('ViewOptionSubmitText', { back: true })
  }, {
    title: '关于',
    onPress: () => this.props.navigation.navigate('ViewOptionSubmitText', { back: true })
  }],
  d: [{
    title: '切换账号',
    button: true,
    onPress: async () => {
      props.dispatch(account.accountEnterLogout())
    }
  }]
})

export default connect(
  state => ({ account: state.account })
)(class SettingMenu extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '设置'
    }
  }

  constructor(props) {
    super(props)
    this.state = { source: dataSource.cloneWithRowsAndSections(SETTING_ARGS(this.props)) }
  }

  // async readCacheSize() {
  //   try {
  //     const document = await fs.stat(`${DocumentDirectoryPath}/images`)
  //     return document.size
  //   } catch (e) {
  //     return 0
  //   }
  // }

  // async getSource() {
  //   const { mobile = '', uid = '', referrer = '' } = this.props.account

  //   return SETTING_ARGS
  // }


  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  render() {
    const { navigation } = this.props
    const { index, routes } = this.state

    return (
      <View style={{ height: Screen.window.height - 64 }}>
        <ListView
          style={{ flex: 1, backgroundColor: '#f5f5f5' }}
          dataSource={this.state.source}
          renderRow={(data, section, index) => <Item data={data} />}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={(data, section) => {
            if (section === 'a') return (<View style={{ height: 12, borderBottomWidth: .5, borderColor: '#eaeaea' }} />)
            if (section === 'd') return (<View style={{ height: 32, borderTopWidth: .5, borderBottomWidth: .5, borderColor: '#eaeaea' }} />)
            return (<View style={{ height: 12, borderTopWidth: .5, borderBottomWidth: .5, borderColor: '#eaeaea' }} />)
          }}
          renderSeparator={(section, row) => {
            if (section === 'd' && row === '0') return (<View style={{ height: Define.system.ios.plus ? 1 : .5, backgroundColor: '#eaeaea' }} />)
            return (<View style={{ paddingLeft: 12, backgroundColor: 'white' }}><View style={{ height: Define.system.ios.plus ? 1 : .5, backgroundColor: '#eee' }} /></View>)
          }}
        />
      </View>
    )
  }
})

class Item extends Component {
  render() {
    const {
      title = '',
      value = '',
      underline = true,
      onPress = () => {},
      button = false,
      editable = true
    } = this.props.data

    return (
      button ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
          <Text style={{ color: '#333', fontSize: 15 }}>{ title }</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={editable ? onPress : () => {}} activeOpacity={0.7} style={{ paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
          <Text style={{ color: '#333', fontSize: 15, fontWeight: '400' }}>{title}</Text>
          <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 15, marginRight: editable ? 0 : 10 }}>{value}</Text>
            { editable ? Icons.Generator.Material('chevron-right', 24, '#bbb') : null }
          </View>
        </TouchableOpacity>
      )
    )
  }
}