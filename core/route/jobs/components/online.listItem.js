import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, StyleSheet
} from 'react-native'
import moment from 'moment'
import { Screen, Icons, Session, TextFont } from '../../../utils'
import OrderSlider from './order.slider'
const { height, width } = Screen.window

export default class OfflineListItem extends PureComponent {

  render() {
    const { itemData, itemDay, onPress = () => { } } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData

    return (
      <View style={styles.container}>
        <View style={[styles.text_cell,{justifyContent:'space-between'}]}>
          <View style={{flexDirection:'row'}}>
            <Text  style={styles.orderDate}>{moment(booking_at).format('MM-DD HH:mm')}</Text>
            <Text  style={styles.status}>{'~ 15km'}</Text>
          </View>
          <Text  style={styles.fare}>{fare}</Text>
        </View>
        <View style={styles.text_cell}>
          <View style={[styles.dot,{backgroundColor:'#FEA81C'}]}/>
          <Text  style={styles.adress}>{from.name}</Text>
        </View>
        <View style={styles.text_cell}>
          <View style={[styles.dot,{backgroundColor:'#7ED321'}]}/>
          <Text  style={styles.adress}>{destination.name}</Text>
        </View>
        <OrderSlider  sliderChange={this.props.sliderChange}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 20, marginLeft: 10, marginBottom: 15, backgroundColor: '#fff',flex:1,paddingTop:15,paddingHorizontal:15
  },
  info_cell: {
    flexDirection: 'row', justifyContent: 'space-between',flex:1
  },
  text_cell:{
    flexDirection:'row',flex:1,alignItems:'center',paddingBottom:15
  },
  orderDate:{
    fontSize: TextFont.TextSize(14), fontWeight: 'bold', color: '#aaaaaa'
  },
  status:{
    fontSize: TextFont.TextSize(15), fontWeight: 'bold', color: '#2ed37e',marginLeft:15
  },
  fare:{
    fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: '#000',
  },
  dot:{
    height: 10, width: 10, borderRadius: 5,
  },
  adress:{
    fontSize: TextFont.TextSize(18), fontWeight: 'bold', color: '#404040',marginLeft:15
  },
  content: {
    height: 40, width: width - 40, position: 'absolute', top: 5, left: 0, backgroundColor: '#ccc', flexDirection: 'row', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'
  },
  circle: {
    height: 50, width: height / 13, borderRadius: 25, justifyContent: 'center', alignItems: 'center',
  }
})
