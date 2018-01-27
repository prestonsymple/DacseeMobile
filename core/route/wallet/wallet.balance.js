
import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define } from '../../utils'
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

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ data: state.booking }))
(class WalletBalanceScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '钱包'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      wallet: [{
        name: '',
        describer: 'TOTAL BALANCE',
        balance: 3420.80,
        prefix: 'RM ',
        content: (
          <View style={{ marginTop: 12, flexDirection: 'row', height: 28, width: 200, justifyContent: 'space-between' }}>
            <Button style={{ width: 90, backgroundColor: '#f2f2f2', borderRadius: 4 }}>
              <Text style={{ fontSize: 12, color: '#484b66', fontWeight: '600' }}>Deposit</Text>
            </Button>
            <Button style={{ width: 90, backgroundColor: '#484b66', borderRadius: 4 }}>
              <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>Withdraw</Text>
            </Button>
          </View>
        )
      }, {
        name: '',
        describer: 'TOTAL',
        balance: 0.52,
        prefix: '',
        suffix: ' TOKEN',
        content: (
          <View style={{ marginTop: 12, flexDirection: 'row', height: 28, width: 200, justifyContent: 'center' }}>
            <Button style={{ width: 90, backgroundColor: '#484b66', borderRadius: 4 }}>
              <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>Sell</Text>
            </Button>
          </View>
        )
      }],
      loading: false,
      detail: dataContrast.cloneWithRows(DEMO_DATA)
    }
    this.page = new Animated.Value(0)
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  render() {
    const { wallet, detail } = this.state
    const wrapWidth = width

    return (
      <View style={{ backgroundColor: '#f4f7fb', flex: 1 }}>
        {/* CARD */}
        <View style={{ height: 232 }}>
          <ScrollView 
            pagingEnabled={true}
            onScroll={({ nativeEvent }) => { 
              const { contentInset, contentOffset, contentSize, layoutMeasurement, velocity, zoomScale } = nativeEvent
              if (contentOffset.x < 0) return;
              this.page.setValue(contentOffset.x)
            }}
            scrollEventThrottle={(width - 30) / 15}
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', height: 230 }}
            style={{ marginTop: 0 }}
          >
            {
              wallet.map((item, index) => {
                return (
                  <View key={`k_${index}`} style={{ width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={[
                      { width: width - 30, backgroundColor: 'white', height: 200, borderRadius: 6 },
                      { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
                      { justifyContent: 'center', alignItems: 'center' }
                    ]}>
                      <Text style={{ color: '#939699', fontWeight: '200', fontSize: 15}}>{ item.describer }</Text>
                      <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <Text style={{ color: '#484b66', fontWeight: '600', fontSize: 28, fontFamily: 'Cochin' }}>{ item.prefix }</Text>
                        <Text style={{ color: '#484b66', fontWeight: '600', fontSize: 28, fontFamily: 'Cochin' }}>{ item.balance.toFixed(2) }</Text>
                        <Text style={{ color: '#484b66', fontWeight: '600', fontSize: 28, fontFamily: 'Cochin' }}>{ item.suffix }</Text>
                      </View>
                      { item.content }
                    </View>
                  </View>
                )
              })
            }
          </ScrollView>
          <View style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 30, height: 2, flexDirection: 'row', alignItems: 'center' }}>
              <Animated.View style={[
                { height: 2, marginHorizontal: 1 },
                { backgroundColor: this.page.interpolate({
                  inputRange: [0, wrapWidth, wrapWidth * 2],
                  outputRange: ['#484b66', '#ddd', '#ddd']
                })},
                { width: this.page.interpolate({
                    inputRange: [0, wrapWidth, wrapWidth * 2],
                    outputRange: [10, 6, 6]
                })}
              ]} />
              <Animated.View style={[
                { height: 2, marginHorizontal: 1 },
                { backgroundColor: this.page.interpolate({
                  inputRange: [0, wrapWidth, wrapWidth * 2],
                  outputRange: ['#ddd', '#484b66', '#ddd']
                })},
                { width: this.page.interpolate({
                    inputRange: [0, wrapWidth, wrapWidth * 2],
                    outputRange: [6, 10, 6]
                })}
              ]} />
            </View>
          </View>
        </View>

        {/* DETAIL */}
        <ListView 
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <DetailItem data={row} />}
          renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f4f7fb' }} />}
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
            <Text style={{ fontSize: 14, color: '#555', fontWeight: '600', marginBottom: 8 }}>{ title }</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 11, color: '#999', fontWeight: '400' }}>今天 </Text>
              <Text style={{ fontSize: 11, color: '#999', fontWeight: '400', fontFamily: 'Cochin', top: .5 }}>{ time }</Text>
            </View>
          </View>
          <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            {
              type === 'in' ?
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#e74a6e', fontWeight: '400', fontFamily: 'Cochin', top: -2.5, marginRight: 5 }}>+</Text> :
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#6bd19e', fontWeight: '400', fontFamily: 'Cochin', top: -2.5, marginRight: 5 }}>-</Text>
            }
            <Text style={{ fontSize: 18, textAlign: 'right', color: '#555', fontWeight: '400', fontFamily: 'Cochin' }}>{ cost.toFixed(2) }</Text>
          </View>
        {/* </View> */}
      </View>
    )
  }
}