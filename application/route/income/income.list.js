import React, { Component } from 'react'
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import * as Progress from 'react-native-progress'
import { connect } from 'react-redux'

import { Screen, Icons, Define, Session,TextFont } from '../../utils'
import resources from '../../resources'
const { height, width } = Screen.window
import { application, booking } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
export default connect(state => ({ }))(class IncomeList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '收入'
    }
  }

  constructor(props) {
    super(props)
    const { floatingDriverAmount, floatingPassengerAmount } = this.props.walletInfo
    this.state = {
      float_driver: floatingDriverAmount === undefined ? 0 : floatingDriverAmount,
      float_passenger: floatingPassengerAmount === undefined ? 0 : floatingPassengerAmount
    }
  }

  render() {
    const { float_driver, float_passenger } = this.state
    return (
      <View style={{ flex: 1, width: width}}>
        <ScrollView style={{ backgroundColor: '#f8f8f8' }}>
          <IncomeCardContent>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image resizeMode={'cover'} style={{ width:50, height: 50 }} source={resources.image.floating_driver} />
              <View style={{ marginLeft: 30 }}>
                <Text style={{ fontSize: TextFont.TextSize(26), color: '#333', fontWeight: '600' }}>{ float_driver.toFixed(2) }</Text>
                <Text style={{ marginTop: 10, color: '#999' ,fontSize:TextFont.TextSize(14)}}>
                  <FormattedMessage id={'floating_amount_driver'}/>
                </Text>
                {/* <Text style={{ fontSize: 14, color: '#666', fontWeight: '400', top: -2.5 }}>TOKEN</Text> */}
              </View>

              <View style={{ height: .8, backgroundColor: '#f2f2f2', marginVertical: 20 }} />
            </View>

            {/* <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, color: '#666', fontWeight: '400' }}>TRIP</Text>
              <Text style={{ right: -5, fontSize: 14, color: '#333', fontWeight: '400', marginRight: 10 }}>1/2</Text>
            </View> */}
            {/* <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Progress.Bar
                width={width - 70}
                height={2}
                borderRadius={1}
                useNativeDriver={true}
                borderWidth={0}
                progress={0.5}
                indeterminate={false}
                color={'#666'}
                unfilledColor={'#eee'}
              />
            </View> */}
          </IncomeCardContent>

          <IncomeCardContent>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image resizeMode={'cover'} style={{ width:50, height: 50 }} source={resources.image.floating_passenger} />
              <View style={{ marginLeft: 30 }}>
                <Text style={{ fontSize: TextFont.TextSize(26), color: '#333', fontWeight: '600' }}>{ float_passenger.toFixed(2) }</Text>
                <Text style={{ marginTop: 10, color: '#999' ,fontSize:TextFont.TextSize(14)}}>
                  <FormattedMessage id={'floating_amount_passenger'}/>
                </Text>
                {/* <Text style={{ fontSize: 14, color: '#666', fontWeight: '400', top: -2.5 }}>TOKEN</Text> */}
              </View>

              <View style={{ height: .8, backgroundColor: '#f2f2f2', marginVertical: 20 }} />
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{  }}>
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '400', marginRight: 10 }}>Level 1</Text>
                <Text style={{ fontSize: 20, color: '#333', fontWeight: '400', marginRight: 10 }}>200</Text>
              </View>

              <View style={{  }}>
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '400', marginRight: 10 }}>Level 2</Text>
                <Text style={{ fontSize: 20, color: '#333', fontWeight: '400', marginRight: 10 }}>650</Text>
              </View>

              <View style={{  }}>
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '400', marginRight: 10 }}>Level 3</Text>
                <Text style={{ fontSize: 20, color: '#333', fontWeight: '400', marginRight: 10 }}>350</Text>
              </View>
            </View> */}
          </IncomeCardContent>
          {/* <IncomeCardContent>
            <Text style={{ color: '#333', fontSize: 18, fontWeight: '400' }}>Total Downline</Text>
            <View style={{ height: .8, backgroundColor: '#f2f2f2', marginVertical: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '400', marginRight: 10 }}>DRIVER</Text>
                <Text style={{ fontSize: 20, color: '#333', fontWeight: '400', marginRight: 10 }}>200</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: '#666', fontWeight: '400', marginRight: 10 }}>PASSENGER</Text>
                <Text style={{ fontSize: 20, color: '#333', fontWeight: '400', marginRight: 10 }}>650</Text>
              </View>
            </View>
          </IncomeCardContent> */}
        </ScrollView>
      </View>
    )
  }
})

class IncomeCardContent extends Component {
  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
        <View style={[
          { backgroundColor: 'white', borderRadius: 4, width: width - 30, paddingHorizontal: 20, paddingVertical: 20 },
          { shadowOffset: { width: 0, height: 1 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
        ]}>
          { this.props.children }
        </View>
      </View>
    )
  }
}
