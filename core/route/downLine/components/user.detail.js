import React, { PureComponent } from 'react'
import {
  Text, View
} from 'react-native'
import { FormattedMessage } from 'react-intl'
import {TextFont} from '../../../utils'
export default class UserDetail extends PureComponent {
  render() {
    const {data} = this.props
    const {referral,joinedOn,phoneCountryCode,phoneNo,level}=data
    return (
      <View style={{paddingHorizontal:20,paddingTop:20,backgroundColor:'#fff'}}>
        <InfoCell cellname='referrer_name' value={referral.fullName?referral.fullName:''} />
        <InfoCell cellname='join_date' value={joinedOn} />
        <InfoCell cellname='phone' value={phoneCountryCode?`${phoneCountryCode} ${phoneNo}` :'' } />
        <InfoCell cellname='downline_level' value={level} />
      </View>
    )
  }
}
class InfoCell extends PureComponent {
  render(){
    const { cellname,value } = this.props
    if(!value){
      return null
    }
    return(
      <View style={{flexDirection:'row',justifyContent:'space-between',height:40}}>
        <Text style={{color:'#ccc',fontSize:TextFont.TextSize(15)}}>
          <FormattedMessage id={cellname}/>
        </Text>
        <Text style={{color:'#000',fontSize:TextFont.TextSize(15)}}>{value}</Text>
      </View>
    )
  }
}

