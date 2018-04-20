/**
 * @flow
 * Created by Rabbit on 2018/4/20.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput, ScrollView, TouchableOpacity
} from 'react-native'
import Input from '../../components/input'

import { System, Screen } from '../../utils'

const { width, height } = Screen.window

type Props = {};
export default class JobsAdd extends Component < Props > {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView >
          <InfoInput title={'Registration Number'} placeholder={'Please enter here'}
            onChangeText={(text)=>{
              console.log(text)
            }}
          />
          <InfoInput title={'Manufacturer'}   placeholder={'Please enter here'}
            onChangeText={(text)=>{
              console.log(text)
            }}
          />
          <InfoInput title={'Model'}   placeholder={'Please enter here'}
            onChangeText={(text)=>{
              console.log(text)
            }}
          />
          <InfoInput title={'Manufacture Year'}   placeholder={'Please enter here'}
            onChangeText={(text)=>{
              console.log(text)
            }}
          />
          <InfoInput title={'Color'} placeholder={'Please enter here'}
            onChangeText={(text)=>{
              console.log(text)
            }}
          />
        </ScrollView>
        <View style={{flexDirection: 'row', height: 85, justifyContent: 'space-around'}}>
          <TouchButton title={'CANCEL'} backgroundColor={'#cfcfcf'}/>
          <TouchButton title={'SUBMIT'} backgroundColor={'#5FD700'}/>
        </View>
      </View>
    )
  }
}

function TouchButton(props) {
  const { style, title, backgroundColor} = props
  return(
    <TouchableOpacity style={[styles.touchButton,{backgroundColor}]}>
      <Text style={{fontSize: 18, color:'black', fontWeight: 'bold'}}>{title}</Text>
    </TouchableOpacity>
  )
}

function InfoInput(props) {
  const { style, placeholder, title} = props
  return(
    <View style={[{paddingHorizontal: 20,}, style]}>
      <Text style={{fontSize: 16, color: '#000', opacity: 0.8, paddingTop: 10,}}>{title}</Text>
      <Input placeholder={placeholder} style={{height: 44, paddingLeft: 4, fontSize: 15, }} {...props}/>
      <View style={{height: 1, backgroundColor:'#666',}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  touchButton:{
    width: width / 2 - 20,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#cfcfcf',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.21)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1
  }
})