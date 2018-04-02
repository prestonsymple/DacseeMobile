import React, { Component, PureComponent } from 'react'
import { View, Text, TouchableOpacity, DeviceEventEmitter, Alert } from 'react-native'
import { connect } from 'react-redux'
import { FormBuilder, Fileds, EditorBuilder } from '../../components/form-builder'
import InteractionManager from 'InteractionManager'

import Resources from '../../resources'
import BaseScreenComponent from '../_base'
import { Icons,TextFont } from '../../utils'
import { application } from '../../redux/actions'

export default connect(state => ({ a: state.application }))(class UpgradeDriver extends BaseScreenComponent {

  static navigationOptions = () => {
    return Object.assign({}, {
      drawerLockMode: 'locked-closed',
      title: '加入Dacsee',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ width: 74, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.ON.PRESS.NEXT')}
        >
          <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}>下一步</Text>
        </TouchableOpacity>
      )
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      ic_number: '',
      mail: '',
      birth: '',
      address: '',
      mobile: '',

      licese_type: '',
      licese_class: '',
      licese_years: ''
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.ON.PRESS.NEXT', () => this.props.dispatch(application.showMessage('发生错误，API请求超时')))
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    this.subscription && this.subscription.remove()
  }

  render() {
    const {
      name, ic_number, mail, birth, address, mobile, licese_years, licese_expire, licese_type
    } = this.state

    const NodeDOM = new FormBuilder()
      .add('基本信息', [
        Fileds.TextInput('姓名', name, '请填入证件上的全名',
          EditorBuilder('姓名', 'String', {
            value: name,
            onChangeValue: (name) => this.setState({ name })
          })
        ),
        Fileds.TextInput('证件号', ic_number, '请填入您的有效证件号',
          EditorBuilder('证件号', 'String', {
            value: ic_number,
            onChangeValue: (ic_number) => this.setState({ ic_number })
          })
        ),
        Fileds.TextInput('邮箱', mail, '请填入您的邮箱地址',
          EditorBuilder('邮箱', 'String', {
            value: mail,
            onChangeValue: (mail) => this.setState({ mail })
          })
        ),
        Fileds.TextInput('出生日期', birth, '请选择您的出生年月',
          EditorBuilder('出生日期', 'String', {
            value: birth,
            onChangeValue: (birth) => this.setState({ birth })
          })
        ),
        Fileds.TextInput('地址', address, '请输入您的所在地址',
          EditorBuilder('地址', 'String', {
            value: address,
            onChangeValue: (address) => this.setState({ address })
          })
        ),
        Fileds.TextInput('电话号码', mobile, '请输入您的电话号码',
          EditorBuilder('电话号码', 'String', {
            value: mobile,
            onChangeValue: (mobile) => this.setState({ mobile })
          })
        )
      ])
      .add('驾照信息', [
        Fileds.TextInput('准驾车型', licese_type, '请选择您的准驾车型', EditorBuilder('电话号码', 'String', {
          value: licese_type,
          onChangeValue: (licese_type) => this.setState({ licese_type })
        })),
        Fileds.TextInput('有效期', licese_expire, '请选择您的驾照有效期', EditorBuilder('电话号码', 'String', {
          value: licese_expire,
          onChangeValue: (licese_expire) => this.setState({ licese_expire })
        })),
        Fileds.TextInput('驾龄', licese_years, '请输入您的有效驾龄', EditorBuilder('电话号码', 'String', {
          value: licese_years,
          onChangeValue: (licese_years) => this.setState({ licese_years })
        }))
      ])
      .jsx(this.props)

    return NodeDOM
  }

})
