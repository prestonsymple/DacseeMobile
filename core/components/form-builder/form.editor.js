import React, { Component } from 'react'
import { View, Image, Text, TextInput, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import {TextFont} from '../../utils'
const defaultOption = {
  value: '',
  placeholder: '',
  onValidValue: () => {},
  onChangeValue: () => {},
  keyboardType: 'default',
  style: {}
}

class BaseEditor extends Component {

  componentWillUnmount() {
    if (this.subscription === undefined || this.subscription === null || !('remove' in this.subscription)) return
    this.subscription.remove()
  }

  constructor(props) {
    super(props)
    this.state = { value: props.option.value }
  }
}

class NumberEditor extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

class StringEditor extends BaseEditor {

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.EDITOR.CHANGE.VALUE', () => {
      // const value = this.state.value
      this.props.navigation.goBack()
      if (this.state.value && this.props.option.onChangeValue) this.props.option.onChangeValue(this.state.value)
    })
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  render() {
    const { option = {} } = this.props
    const { value, placeholder, onValidValue, onChangeValue, keyboardType, style } = option

    return (
      <View style={{ backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' }}>
        <TextInput
          onChangeText={ val => this.setState({ value: val }) }
          placeholder={placeholder}
          defaultValue={value}
          keyboardType={keyboardType}
          clearButtonMode={'always'}
          style={{ height: 44, paddingLeft: 8, paddingRight: 26 }}
        />
      </View>
    )
  }
}

class DateEditor extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

class DateTimeEditor extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

class FormEditorScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    const { state } = navigation
    const { params } = state
    return Object.assign({}, {
      drawerLockMode: 'locked-closed',
      title: params.title,
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{paddingRight: 15, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.EDITOR.CHANGE.VALUE')}
        >
          <Text style={{ fontSize: TextFont.TextSize(16), color: 'white', fontWeight: '600' }}>{reducer.intl.messages.finish}</Text>
        </TouchableOpacity>
      )
    }, params.navigationOptions || {})
  }

  render() {
    const { state } = this.props.navigation
    const { params } = state
    const NodeComponent = Components[params.editorName]

    console.log(NodeComponent)

    return NodeComponent ? (
      <ScrollView style={{ flex: 1, backgroundColor: '#f8f8f8' }} contentContainerStyle={{ backgroundColor: '#f8f8f8', paddingTop: 15 }}>
        <NodeComponent {...this.props} option={params.option} />
      </ScrollView>
    ) : (<View />)
  }
}



// 不要修改顺序
const Components = {
  String: StringEditor,
  Number: NumberEditor,
  Date: DateEditor,
  DateTime: DateTimeEditor
}

const EditorBuilder= (title, editorName : 'String' | 'Number' | 'Date' | 'DateTime', option = {}, navigationOptions = {}) => {
  const opt = Object.assign({}, defaultOption, option)
  return (navigation) => {
    navigation.navigate('FormEditor', {
      title: title || '编辑', navigationOptions, editorName,
      option: opt
    })
  }
}

export {
  EditorBuilder,
  FormEditorScreen
}



