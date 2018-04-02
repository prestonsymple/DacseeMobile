import React, { Component, PureComponent } from 'react'
import {
  View, ListView, Text, Image, StatusBar, Keyboard, TouchableOpacity
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { Icons, Session ,TextFont} from '../../utils'
import { account, application } from '../../redux/actions'

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ account: state.account }))(class LoginSelectAccountScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '选择您的账号'
    }
  }

  constructor(props) {
    super(props)
    const { data } = this.props.navigation.state.params
    this.state = {
      dataSource: dataContrast.cloneWithRows(data)
    }
  }

  async componentDidUpdate() {
    await InteractionManager.runAfterInteractions()
    Keyboard.dismiss()
  }

  render() {
    const { value } = this.props.navigation.state.params
    const { isMail } = value

    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'light-content'} />
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(row) => (<RowItem isMail={isMail} onPress={async () => {
            if (isMail && row.phoneNo) {
              await Session.User.Post('v1/sendVerificationCode/phone', {
                phoneCountryCode: row.phoneCountryCode,
                phoneNo: row.phoneNo
              })
              this.props.dispatch(application.setMailModeValue(row._id))
              this.props.dispatch(application.showMessage('已将验证码发送至您绑定的手机'))
            } else {
              this.props.dispatch(account.loginNext({ stage: 3, value: Object.assign({}, value, {
                _id: row._id
              }) }))
            }
            this.props.navigation.goBack()
          }} data={row} />)}
          renderSeparator={() => (
            <View style={{ backgroundColor: '#f2f2f2', height: .8 }}></View>
          )}
          style={{ backgroundColor: 'white', flex: 1 }}
        />
      </View>
    )
  }
})

class RowItem extends Component {
  render() {
    const { onPress = () => {}, isMail } = this.props
    const { _id, avatars, fullName, phoneNo } = this.props.data
    // console.log(rights)
    // const role = rights.reduce((prev, next) => prev + `, ${next}`)

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={.7} style={{ height: 68, backgroundColor: 'white', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
          <View style={{ width: 68, justifyContent: 'center' }}>
            <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: avatars[avatars.length - 1].url }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400', marginBottom: 4 }}>{ fullName }</Text>
            { isMail && <Text style={{ fontSize: TextFont.TextSize(12), color: '#666', fontWeight: '400' }}>{ phoneNo ? '已激活' : '未激活' }</Text> }
          </View>
          <View style={{ width: 45, alignItems: 'flex-end' }}>
            { Icons.Generator.Material('keyboard-arrow-right', 26, '#999') }
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
