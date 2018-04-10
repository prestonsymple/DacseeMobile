import React, { Component, PureComponent } from 'react'
import { View, Text, TouchableOpacity, DeviceEventEmitter, Alert } from 'react-native'
import { connect } from 'react-redux'
import { FormBuilder, Fileds, EditorBuilder } from '../../components/form-builder'
import InteractionManager from 'InteractionManager'

import Resources from '../../resources'
import BaseScreenComponent from '../_base'
import { Icons,TextFont } from '../../utils'
import { application } from '../../redux/actions'

export default connect(state => ({ a: state.application, i18n: state.intl.messages || {}, }))(class UpgradeDriver extends BaseScreenComponent {

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
          <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}>{this.props.i18n.next}</Text>
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
    const { i18n }=this.props
    const NodeDOM = new FormBuilder()
      .add(i18n.basic_info, [
        Fileds.TextInput(i18n.name, name, i18n.pls_enter_fullname_certificate,
          EditorBuilder(i18n.name, 'String', {
            value: name,
            onChangeValue: (name) => this.setState({ name })
          })
        ),
        Fileds.TextInput(i18n.id, ic_number, i18n.pls_enter_id,
          EditorBuilder(i18n.id, 'String', {
            value: ic_number,
            onChangeValue: (ic_number) => this.setState({ ic_number })
          })
        ),
        Fileds.TextInput(i18n.email, mail, i18n.pls_enter_email,
          EditorBuilder(i18n.email, 'String', {
            value: mail,
            onChangeValue: (mail) => this.setState({ mail })
          })
        ),
        Fileds.TextInput(i18n.birthday, birth, i18n.pls_enter_birthday,
          EditorBuilder(i18n.birthday, 'String', {
            value: birth,
            onChangeValue: (birth) => this.setState({ birth })
          })
        ),
        Fileds.TextInput(i18n.addr, address, i18n.pls_enter_addr,
          EditorBuilder(i18n.addr, 'String', {
            value: address,
            onChangeValue: (address) => this.setState({ address })
          })
        ),
        Fileds.TextInput(i18n.phone, mobile, i18n.pls_enter_phone_num,
          EditorBuilder(i18n.phone, 'String', {
            value: mobile,
            onChangeValue: (mobile) => this.setState({ mobile })
          })
        )
      ])
      .add(i18n.driver_license_info, [
        Fileds.TextInput(i18n.standard_car, licese_type, i18n.pls_enter_car_type, EditorBuilder(i18n.phone, 'String', {
          value: licese_type,
          onChangeValue: (licese_type) => this.setState({ licese_type })
        })),
        Fileds.TextInput(i18n.validity_period, licese_expire, i18n.pls_enter_license_expiry_date, EditorBuilder(i18n.phone, 'String', {
          value: licese_expire,
          onChangeValue: (licese_expire) => this.setState({ licese_expire })
        })),
        Fileds.TextInput(i18n.drive_age, licese_years, i18n.pls_enter_driving_age, EditorBuilder(i18n.phone, 'String', {
          value: licese_years,
          onChangeValue: (licese_years) => this.setState({ licese_years })
        }))
      ])
      .jsx(this.props)

    return NodeDOM
  }

})
