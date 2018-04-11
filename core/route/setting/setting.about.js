/* @flow */

import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import InteractionManager from 'InteractionManager'
import lodash from 'lodash'
import moment from 'moment'
import CodePush from 'react-native-code-push'
// import fs, { DocumentDirectoryPath } from 'react-native-fs'
import { connect } from 'react-redux'
import marked from 'marked'

/*****************************************************************************************************/
import {
  application
} from '../../redux/actions'
import {
  Screen, Icons, Define, System,TextFont
} from '../../utils'
import resources from '../../resources'
/*****************************************************************************************************/

export default connect(state => ({ i18n: state.intl.messages || {}}))(class SettingAboutScreen extends Component {

  static navigationOptions = () => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.about,
      drawerLockMode: 'locked-closed'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      rnVersion: ''
    }
  }

  async componentDidMount() {
    const runningBundle = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
    this.setState({ rnVersion: (runningBundle ? runningBundle.label : '0') })
  }

  renderHtml(html: string) {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charset="utf-8" />
          <style>
            h3, h4 { font-weight: 400 }
            h3 { font-size: 16px; color: '#333' }
            h4 { font-size: 14px; color: '#666' }
            p { font-size: 13px; color: '#666' }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `
  }

  render() {
    const { navigate,state } = this.props.navigation
    const { rnVersion } = this.state
    const { i18n }=this.props
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }} style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
            <Image style={{ borderRadius: 11, width: 88, height: 88 }} source={resources.image.logo} />
            <View style={{ alignItems: 'center', marginTop: 25, height: 30, justifyContent: 'space-between' }}>
              <Text style={{ fontSize: TextFont.TextSize(15), color: '#666' }}>{`${i18n.version}: ${System.Version}-${ rnVersion.replace('v', '') }`}</Text>
            </View>
            <View style={{ width: Screen.window.width, marginTop: 35, borderTopWidth: Define.system.ios.plus ? 1 : .5, borderBottomWidth: Define.system.ios.plus ? 1 : .5, borderColor: '#eaeaea' }}>
              <TouchableOpacity onPress={() => Alert.alert('', i18n.app_not_ready_yet)} activeOpacity={0.7} style={{ paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
                <Text style={{ color: '#333', fontSize: TextFont.TextSize(15), fontWeight: '400' }}>{i18n.rating_appstore}</Text>
                { Icons.Generator.Material('chevron-right', 24, '#bbb') }
              </TouchableOpacity>
              <View style={{ paddingLeft: 12, backgroundColor: 'white' }}><View style={{ borderTopWidth: .5, borderColor: '#eaeaea' }} /></View>
              <TouchableOpacity onPress={() => Alert.alert('', i18n.doc_not_received)} activeOpacity={0.7} style={{ paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
                <Text style={{ color: '#333', fontSize: TextFont.TextSize(15), fontWeight: '400' }}>{i18n.privacy_policy}</Text>
                { Icons.Generator.Material('chevron-right', 24, '#bbb') }
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 15, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#b1b1b1', fontSize: TextFont.TextSize(11), backgroundColor: 'transparent' }}>2017-2018 DACSEE All rights reserved.</Text>
        </View>
      </View>
    )
  }
})
