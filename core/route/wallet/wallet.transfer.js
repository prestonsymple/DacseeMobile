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

export default class WalletTransferScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '转账'
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
          <View style={{}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Sending Amount</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              <Text style={{ fontSize: 14 }}>RM</Text>
              <TextInput style={{ paddingLeft: 10, fontSize: 14}} placeholder={'0.00'}/>
            </View>
            <View style={{ height: 1, backgroundColor: '#a5a5a5' }}></View>
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Recipient Account</Text>
            <TouchableOpacity style={{ height: 40, justifyContent: 'center' }}>
              <Text style={{}}>Contact Number</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#a5a5a5' }}></View>
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Recipient Contact Number</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ height: 40, justifyContent: 'center' }}>
                <Text style={{}}>Malaysia(+60)</Text>
              </TouchableOpacity>
              <TextInput style={{ paddingLeft: 10, fontSize: 14}} placeholder={'Phone Number'}/>
            </View>            
            <View style={{ height: 1, backgroundColor: '#a5a5a5' }}></View>
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Remarks</Text>
            <TextInput style={{ marginVertical: 10, fontSize: 14, height: 70}} placeholder={'Please Enter'} multiline={true}/>
            <View style={{ height: 1, backgroundColor: '#a5a5a5' }}></View>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button onPress={ () => this.props.navigation.navigate('WalletTransferSelection')} style={{ width:240, height: 44, backgroundColor: '#4cb1f7', borderRadius: 4 }}>
              <Text style={{ fontSize: 20, color: 'white' }}>CONTINUE</Text>
            </Button>
          </View>
        </View>
      </ScrollView>       
    )
  }
}