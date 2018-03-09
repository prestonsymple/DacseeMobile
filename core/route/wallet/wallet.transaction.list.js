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

const DEMO_DATA = [{
  type: 'in',
  cost: .8,
  title: '分成',
  time: '13:28'
}, {
  type: 'out',
  cost: 30.4,
  title: '行程订单消费',
  time: '09:11'
}, {
  type: 'out',
  cost: 58.2,
  title: '行程订单消费',
  time: '07:47'
}, {
  type: 'in',
  cost: 3200.00,
  title: '支付宝充值',
  time: '05:44'
}]

export default connect(state=> ({ data: state.booking }))(class WalletTransactionListScreen extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '钱包'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows(DEMO_DATA)
    }
  }

  render() {
    const { wallet, detail } = this.state
    const wrapWidth = width

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1, width: width}}>
        {/* DETAIL */}
        <ListView 
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <DetailItem data={row} />}
          renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
          style={{ flex: 1, height: 30, marginTop: 15 }}
        />
      </View>
    )
  }
})

class DetailItem extends Component {
  render() {
    const { data } = this.props
    const { type, cost, title, time } = data

    return (
      <View style={{ paddingHorizontal: 26, flex: 1, height: 64, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* <View style={{  }}> */}
        <View style={{ width: 40 }}>
          { 
            type === 'in' ?
              Icons.Generator.Material('arrow-upward', 18, '#e74a6e') :
              Icons.Generator.Material('arrow-downward', 18, '#6bd19e')
          }
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, color: '#555', fontWeight: System.Platform.Android ? '400' : '600', marginBottom: 8 }}>{ title }</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 11, color: '#999', fontWeight: '400' }}>今天 </Text>
            <Text style={{ fontSize: 11, color: '#999', fontWeight: '400', fontFamily: 'Cochin', top: .5 }}>{ time }</Text>
          </View>
        </View>
        <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {
            type === 'in' ?
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#e74a6e', fontWeight: '400', fontFamily: 'Cochin', top: System.Platform.Android ? 0 : -2.5, marginRight: 5 }}>+</Text> :
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#6bd19e', fontWeight: '400', fontFamily: 'Cochin', top: System.Platform.Android ? 0 : -2.5, marginRight: 5 }}>-</Text>
          }
          <Text style={{ fontSize: 18, textAlign: 'right', color: '#555', fontWeight: System.Platform.Android ? '200' : '400', fontFamily: 'Cochin' }}>{ cost.toFixed(2) }</Text>
        </View>
        {/* </View> */}
      </View>
    )
  }
}