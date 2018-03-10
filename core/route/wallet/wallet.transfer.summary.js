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

export default class WalletTransferSummaryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '转账确认'
    }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (      
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} >
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Sending Wallet</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              <Text style={{ fontSize: 14 }}>Agent Balance Credit</Text>              
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Sending Amount</Text>
            <View style={{ height: 40, justifyContent: 'center' }}>
              <Text style={{}}>RM 150.00</Text>
            </View>            
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Recipient Account</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image style={{ marginVertical: 15, marginRight: 15, width: 66, height: 66, borderRadius: 33, backgroundColor: '#4cb'}}/>
              <View style={{ justifyContent: 'center'}}>
                <Text style={{ fontSize: 11, opacity: 0.6 }}>MA-064123</Text>
                <Text style={{ fontSize: 17 }}>Wai Seng</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Remarks</Text>
            <Text style={{ marginVertical: 10, fontSize: 14 }}>Transfer To Foo</Text>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button onPress={ () => {}} style={{ width:240, height: 44, backgroundColor: '#4cb1f7', borderRadius: 4 }}>
              <Text style={{ fontSize: 20, color: 'white' }}>CONFIRM</Text>
            </Button>
          </View>
        </View>
      </ScrollView>       
    )
  }
}