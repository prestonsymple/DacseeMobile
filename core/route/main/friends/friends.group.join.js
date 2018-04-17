/**
 * Created by Rabbit on 2018/4/17.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image, TouchableOpacity,
} from 'react-native'
import {Icons, Screen, Define, Session, TextFont, System} from '../../../utils'
const { width, height } = Screen.window


export default class FriendsGroupJoin extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.invited}>
          <Image style={styles.invitedImage}/>
          <Text style={styles.invitedTitle}>You are invited by Hao</Text>
        </TouchableOpacity>

        <View style={styles.infoView}>
          <Image style={styles.infoAvatar}/>
          <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center', backgroundColor:'#d7d7d7', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 3, marginTop: 10}}>
            {Icons.Generator.Material('lock', 15, '#797979')}
            <Text style={{fontSize:13, color:'#000', opacity: 0.8, marginLeft: 3}}>public</Text>
          </View>
          <Text style={{marginLeft: 5, color:'#000', fontSize: 19, marginTop: 5}}>Co-Worker Group</Text>
          <Text style={{marginLeft: 5, color:'#000', opacity: 0.8, marginTop: 5}}>100 Members</Text>
          <Text style={{marginLeft: 5, color:'#000', opacity: 0.7, fontSize: 14, marginTop: 5}}>DACSEE member only</Text>
        </View>

        <View style={styles.bottomView}>
          <BottomViewForOneButton title={'JOIN GROUP'} onPress={()=>alert('JOIN GROUP')}/>
          {/*<BottomViewForTwoButton rejectPress={()=>alert('REJECT')} joinPress={()=>alert('JOIN')}/>*/}
        </View>

      </View>
    )
  }
}

function BottomViewForOneButton(props) {
  const { title, onPress } = props
  return(
    <View style={{flexDirection:'row', justifyContent: 'space-around', width}}>
      <BottomButton title={title} style={{backgroundColor:'#7dd320',  minWidth: width - 80, marginHorizontal: 40}} onPress={onPress} titleColor={'black'}/>
    </View>
  )
}

function BottomViewForTwoButton(props) {
  const { rejectPress, joinPress } = props
  return(
    <View style={{flexDirection:'row', justifyContent: 'space-around', width}}>
      <BottomButton title={'REJECT'} style={{backgroundColor:'#ff2239', minWidth: width/2 - 20, marginHorizontal:10}} onPress={rejectPress} titleColor={'white'}/>
      <BottomButton title={'JOIN'} style={{backgroundColor:'#7dd320',  minWidth: width/2 - 20, marginHorizontal: 10}} onPress={joinPress} titleColor={'black'}/>
    </View>
  )
}

function BottomButton(props) {

  const { title, style, onPress, titleColor='white'} = props

  return(
    <TouchableOpacity style={[styles.bottomButton,style]} onPress={onPress}>
      <Text style={{fontSize: 17, fontWeight: 'bold', color: titleColor }}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'space-between'
  },
  invited: {
    height: 60,
    minWidth: 300,
    // justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 14,
    borderRadius: 50,
    backgroundColor: '#ffb539',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 1
  },
  invitedImage:{
    backgroundColor: 'red',
    height: 46,
    width: 46,
    marginLeft: 10,
    borderRadius: 23,
  },
  invitedTitle:{
    marginLeft:20,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)'
  },

  infoView: {
    // marginTop: 88,
    alignItems: 'center',
    marginBottom: 40,
  },
  infoAvatar:{
    height: 104,
    width: 104,
    borderRadius: 52,
    backgroundColor: 'red',
  },

  bottomView:{
    marginBottom: 20
  },

  bottomButton:{
    borderRadius: 36,
    backgroundColor: '#ff2239',
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 66,
  }
})