import React, { Component, PureComponent } from 'react'
import { View, Image } from 'react-native'
import { connect } from 'react-redux'
import { FormBuilder, Fileds, EditorBuilder } from '../../components/form-builder'

import Resources from '../../resources'
import BaseScreenComponent from '../_base'

export default connect(state => ({ a: state.application }))(class UpgradeDriver extends BaseScreenComponent {

  static navigationOptions = () => {
    return Object.assign({}, {
      drawerLockMode: 'locked-closed', 
      data: {
        name: '',
        ic_number: '',
        mail: '',
        birth: '',
        address: '',
        mobile: '',

        class: '',
        expire: '',


      },
      title: '加入Dacsee'
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      value: 'aaaaaaa'
    }
  }

  render() {

    const NodeDOM = new FormBuilder()
      .add('基本信息', [
        Fileds.TextInput('姓名', this.state.value, '请填入证件上的全名', 
          EditorBuilder('姓名', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        ),
        Fileds.TextInput('证件号', '', '请填入您的有效证件号',
          EditorBuilder('证件号', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        ),
        Fileds.TextInput('邮箱', '', '请填入您的邮箱地址', 
          EditorBuilder('邮箱', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        ),
        Fileds.TextInput('出生日期', '', '请选择您的出生年月', 
          EditorBuilder('出生日期', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        ),
        Fileds.TextInput('地址', '', '请输入您的所在地址', 
          EditorBuilder('地址', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        ),
        Fileds.TextInput('电话号码', '', '请输入您的电话号码', 
          EditorBuilder('电话号码', 'String', { 
            value: this.state.value, 
            onChangeValue: (value) => this.setState({ value })
          })
        )
      ])
      .add('驾照信息', [
        Fileds.TextInput('准驾车型', '', '请选择您的准驾车型', () => {}),
        Fileds.TextInput('有效期', '', '请选择您的驾照有效期', () => {}),
        Fileds.TextInput('驾龄', '', '请输入您的有效驾龄', () => {})
      ])
      .jsx(this.props)

    return NodeDOM
  }

})