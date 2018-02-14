import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'
import * as Progress from 'react-native-progress'

import { Screen, Icons, Define } from '../../utils'
const { height, width } = Screen.window

export default class IncomeList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '收入'
    }
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: '#f8f8f8' }}>
          <IncomeCardContent>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 26, color: '#333', fontWeight: '600', marginRight: 10 }}>300.00</Text>
              <Text style={{ fontSize: 14, color: '#666', fontWeight: '400', top: -2.5 }}>TOKEN</Text>
            </View>
            <Text style={{ color: '#999' }}>Total Floating Commision</Text>
            <View style={{ height: .8, backgroundColor: '#f2f2f2', marginVertical: 20 }} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, color: '#666', fontWeight: '400' }}>TRIP</Text>
              <Text style={{ right: -5, fontSize: 14, color: '#333', fontWeight: '400', marginRight: 10 }}>1/2</Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
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
            </View>
          </IncomeCardContent>

          <IncomeCardContent>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 26, color: '#333', fontWeight: '600', marginRight: 10 }}>300.00</Text>
              <Text style={{ fontSize: 14, color: '#666', fontWeight: '400', top: -2.5 }}>TOKEN</Text>
            </View>
            <Text style={{ color: '#999' }}>Total Commision</Text>
            <View style={{ height: .8, backgroundColor: '#f2f2f2', marginVertical: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            </View>
          </IncomeCardContent>

          <IncomeCardContent>
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
          </IncomeCardContent>
        </ScrollView>
      </View>
    )
  }
}


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