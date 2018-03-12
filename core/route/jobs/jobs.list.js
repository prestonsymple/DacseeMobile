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

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

// const DEMO_DATA = [
//   {
//     "_id": "5a9796b18360f70579ad48c2",
//     "type": "now",
//     "assign_type": "any",
//     "from": {
//         "address": "SetiaWalk Mall Taman Wawasan Puchong Selangor Malaysia",
//         "coords": {
//             "lat": 3.0319002,
//             "lng": 101.61730339999997
//         },
//         "name": "SetiaWalk Mall",
//         "placeId": "ChIJyWmMG1VLzDER651sEIJsamI"
//     },
//     "notes": "Klcc",
//     "destination": {
//         "address": "KLCC Carpark Persiaran KLCC Kuala Lumpur Federal Territory of Kuala Lumpur Malaysia",
//         "coords": {
//             "lat": 3.1536431,
//             "lng": 101.71568809999997
//         },
//         "name": "KLCC Carpark",
//         "placeId": "ChIJD8xI_9I3zDERoM1zhIlBXG8"
//     },
//     "vehicle_type": "Economy",
//     "booking_at": "2018-03-03T13:16:00.212Z",
//     "payment_method": "Cash",
//     "fare": 30,
//     "passenger_id": "5a697a7333f82544619072dd",
//     "drivers_queue": [],
//     "status": "No_Taker",
//     "payment_status": "unpaid",
//     "_createdOn": "2018-03-01T05:59:13.191Z",
//     "_createdBy": "5a697a7333f82544619072dd",
//     "_updatedOn": "2018-03-01T05:59:43.212Z",
//     "_updatedBy": "5a547dff2dd97f23dc6a06c6",
//     "processing": false,
//     "excludedDrivers_id": [
//         "5a4a36d9812d94d4dadf6f43",
//         "5a4dfb482dd97f23dc6a06c4",
//         "5a697a7333f82544619072dd",
//         "5a697af033f82544619072de",
//         "5a697b4733f82544619072df",
//         "5a697d2733f82544619072e0"
//     ]
// }
// ]
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(() => ({ }))(class JobsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '行程列表'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows([])
    }
  }

  async componentWillMount() {
    await InteractionManager.runAfterInteractions()

    const resp = await Session.booking.get('v1/bookings')
    this.setState({
      detail: dataContrast.cloneWithRows(resp.data)
    })
  }

  render() {
    const { detail } = this.state
    const wrapWidth = width    

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        <ListView 
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <TouchableOpacity onPress={() => this.props.navigation.navigate('JobsListDetail', { jobDetail: row })}><ListItem data={row} /></TouchableOpacity>}
          // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
          style={{ flex: 1, marginTop: 15 }}
        />
      </View>
    )
  }
})

class ListItem extends Component {
  render() {
    const { data } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = data
    return (
      <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={[
          { width: width - 30, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
        ]}>
          <View style={{margin: 15}}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <View style={{ marginLeft: 3, height: 6, width: 6, borderRadius: 3, backgroundColor: 'green' }}></View>
              <Text style={{ marginLeft: 10 }}>{ from.name }</Text>
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{ marginLeft: 3, height: 6, width: 6, borderRadius: 3, backgroundColor: 'red' }}></View>
              <Text style={{ marginLeft: 10 }}>{ destination.name }</Text>
            </View>
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
              <View>{ Icons.Generator.Material('access-time', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 10 }}>{ booking_at }</Text>
            </View>
            <View style={{ marginTop:20, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View>{ Icons.Generator.Material('payment', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 10 }}>{ payment_method }</Text>
              <View style={{ marginLeft: 20 }}>{ Icons.Generator.Material('monetization-on', 14, '#bbb') }</View>
              <Text style={{}}>{ fare }</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>                
                <Text style={{}}>{ status }</Text>
                <View>{ Icons.Generator.Material('chevron-right', 24, '#bbb') }</View>
              </View>              
            </View>
          </View>
        </View>
      </View>
      // <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      //   <View style={[
      //     { width: width - 30, borderRadius: 6, backgroundColor: 'white' },
      //     { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
      //     {  }
      //   ]}>

      //     <View style={{ flex: 1, flexDirection: 'column', height: 106 }}>
      //       <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              
      //         <View style={{ marginLeft: 10, justifyContent: 'center'}}>
      //           <Text style={{ fontSize: 13 }}>{ countryName }</Text>
      //           <Text style={{ fontSize: 11, color: '#a5a5a5' }}>{ name }</Text>
      //         </View>

      //         <View style={{ flex: 1, marginRight: 15, justifyContent: 'center', alignItems: 'flex-end' }}>
      //           <Text style={{ fontSize: 11, color: '#a5a5a5' }}>可用余额</Text>
      //           <View style={{ flexDirection: 'row'}}>
      //             {/* <Text style={{ fontSize: 15, marginTop: 12}}>RM</Text> */}
      //             <Text style={{ fontSize: 27}}>{ availableAmount.toFixed(2) }</Text>
      //           </View>
      //         </View>
      //       </View>
      //       <View style={{ backgroundColor: '#D8D8D8', opacity: 0.5, height: 1}}></View>
      //     </View>
      //   </View>
      // </View>
    )
  }
}