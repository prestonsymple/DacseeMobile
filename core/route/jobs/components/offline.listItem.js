import React, { Component } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, StyleSheet
} from 'react-native'
import moment from 'moment'
import { Screen, Icons, Session, TextFont } from '../../../utils'
import { connect } from 'react-redux'
const { height, width } = Screen.window

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class OfflineListItem extends Component {
  _getStatus(str) {
    let json={}
    let {i18n}=this.props
    switch(str) {
    case 'Pending_Acceptance':json.text=i18n.Pending_Acceptance;json.color= '#2ed37e'
      return json
    case 'On_The_Way':json.text=i18n.On_The_Way;json.color= '#2ed37e'
      return json
    case 'Arrived':json.text=i18n.Arrived;json.color= '#2ed37e'
      return json
    case 'No_Show':json.text=i18n.No_Show;json.color= '#ccc'
      return json
    case 'On_Board':json.text=i18n.On_Board;json.color= '#2ed37e'
      return json
    case 'Completed':json.text=i18n.Completed;json.color= '#2ed37e'
      return json
    case 'Cancelled_by_Passenger':json.text=i18n.Cancelled_by_Passenger;json.color= '#ccc'
      return json
    case 'Cancelled_by_Driver':json.text=i18n.Cancelled_by_Driver;json.color= '#ccc'
      return json
    case 'Rejected_by_Driver':json.text=i18n.Rejected_by_Driver;json.color= '#red'
      return json
    case 'No_Taker':json.text=i18n.No_Taker;json.color= '#ccc'
      return json
    }
  }
  render() {
    const { itemData,itemIndex, itemDay, onPress = () => { }, working } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData
    const optionObject = this._getStatus(status)
    console.log(itemIndex,'itemIndex')
    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress}>
        <View style={[styles.container,{marginTop:itemIndex==0?15:0}]}>
          <View style={[styles.text_cell, { justifyContent: 'space-between',paddingTop:15 }]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.orderDate}>{moment(booking_at).format('MM-DD HH:mm')}</Text>
              <Text style={[styles.order_status,{color:optionObject.color}]}>{optionObject.text}</Text>
            </View>
            <Text style={styles.fare}>{working ? '' : fare}</Text>
          </View>
          <View style={styles.text_cell}>
            <View style={[styles.dot, { backgroundColor: '#FEA81C' }]} />
            <Text style={styles.adress}>{from.name}</Text>
          </View>
          <View style={styles.text_cell}>
            <View style={[styles.dot, { backgroundColor: '#7ED321' }]} />
            <Text style={styles.adress}>{destination.name}</Text>
          </View>
          {working ?
            <View style={[styles.text_cell, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.orderDate}>{}</Text>
                <Text style={styles.order_status}>{'~15km'}</Text>
              </View>
              <Text style={styles.fare}>{fare}</Text>
            </View>:null
          }
        </View>
      </TouchableOpacity>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    width: width - 20, marginLeft: 10, marginBottom: 15, backgroundColor: '#fff', flex: 1, paddingBottom:15, paddingHorizontal: 15, borderRadius: 6
  },
  info_cell: {
    flexDirection: 'row', justifyContent: 'space-between', flex: 1
  },
  text_cell: {
    flexDirection: 'row', flex: 1, alignItems: 'center', paddingTop: 10
  },
  orderDate: {
    fontSize: TextFont.TextSize(14), fontWeight: 'bold', color: '#aaaaaa'
  },
  order_status: {
    fontSize: TextFont.TextSize(14), fontWeight: 'bold', marginLeft: 15
  },
  fare: {
    fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: '#000',
  },
  dot: {
    height: 10, width: 10, borderRadius: 5,
  },
  adress: {
    fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: '#404040', marginLeft: 15
  },
  content: {
    height: 40, width: width - 40, position: 'absolute', top: 5, left: 0, backgroundColor: '#ccc', flexDirection: 'row', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'
  },
  circle: {
    height: 50, width: height / 13, borderRadius: 25, justifyContent: 'center', alignItems: 'center',
  }
})
