import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class WalletTransferSelectionScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '转账-选择账户'
    }
  }

  constructor(props){
    super(props)
    this.state={
      transferInfo: this.props.navigation.state.params.transferInfo,
      detail: dataContrast.cloneWithRows(this.props.navigation.state.params.transferInfo.userList)
    }
  }

  render() {
    const { detail, transferInfo } = this.state
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, opacity: 0.5 }}>查找到多个相关账户</Text>
          <Text style={{ marginTop: 10, fontSize: 13, opacity: 0.5 }}>请选择您要转账的账户</Text>
        </View>

        <ListView 
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <TouchableOpacity onPress={ () => { 
            var temp = transferInfo
            temp.userList = [row]
            
            this.setState({
              transferInfo: temp
            })

            this.props.navigation.navigate('WalletTransferSummary', { transferInfo: this.state.transferInfo }) }
          } activeOpacity={.7}><AccountItem data={row} /></TouchableOpacity> }
          renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
          style={{ flex: 1, marginTop: 30 }}
        />
      </View>
    )
  }
}

class AccountItem extends Component {
  constructor(props) {
    super(props)
    this.state={}
  }

  render() {
    const { data } = this.props
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: data.avatars[0].url }} style={{ margin: 15, width: 66, height: 66, borderRadius: 33 }}/>
        <View style={{ justifyContent: 'center'}}>
          <Text style={{ fontSize: 11, opacity: 0.6 }}>{ data.userId }</Text>
          <Text style={{ fontSize: 17 }}>{ data.fullName }</Text>
        </View>
      </View>
    )
  }
}