import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl, ActivityIndicator
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { application } from '../../../redux/actions'
import { Icons, Screen, Session } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ }))(class FriendsSearchBase extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '查找朋友',
      header: {
        bar: null
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([])
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    // const { data } = await Session.user.get(`v1/search?country=CN&userId=${referrer}`)
    // if (!data || data.length === 0) return this.props.dispatch(application.showMessage('该邀请已失效'))
  }

  omponentWillUnmount() {
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView 
          dataSource={this.state.dataSource} 
          enableEmptySections={true}
          renderSeparator={() => (<View style={{ paddingLeft: 15 }}><View style={{ height: .8, backgroundColor: '#f2f2f2' }} /></View>)}
          style={{ flex: 1 }}
        />
      </View>
    )
  }
})