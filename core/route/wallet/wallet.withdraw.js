
import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const { height, width } = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ data: state.booking }))(class WalletBalanceScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '提现'
    }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  render() {
    const { wallet, detail } = this.state
    const wrapWidth = width

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        {/* CARD */}
        <ScrollView style={{ }} contentContainerStyle={{ paddingTop: 15 }}>
          <View style={{ paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white', height: 64, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: 64 }}>
              
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#666' }}>请先选择银行</Text>
            </View>
            <View style={{ }}>
              { Icons.Generator.Material('chevron-right', 24, '#bbb') }
            </View>
          </View>

          <View style={{ marginBottom: 15, backgroundColor: 'white', paddingHorizontal: 15, height: 64, justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#666', marginTop: 10 }}>银行账号</Text>
            <TextInput {...Define.TextInputArgs} keyboardType={'number-pad'} style={{ fontSize: 20, height: 38 }} placeholder={'请输入您的银行卡号'} />
          </View>

          <View style={{ marginBottom: 15, backgroundColor: 'white', paddingHorizontal: 15, paddingTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#666' }}>提现金额</Text>
            <View style={{ flexDirection: 'row', height: 44, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '400', color: '#666' }}>￥</Text>
              <TextInput {...Define.TextInputArgs} style={{ fontSize: 20, height: 44, width: 200 }} placeholder={'0.00'} />
            </View>
            <View style={{ backgroundColor: '#eee', height: 1, top: -2 }} />
            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: '400', color: '#999' }}>当前最大可提现金额2400.00</Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={{ backgroundColor: '#93eb7a', position: 'absolute', bottom: 0, left: 0, right: 0, height: Define.system.ios.x ? 64 : 44 }}>
          <View style={{ height: 64, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#36552d' }}>提交</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
})