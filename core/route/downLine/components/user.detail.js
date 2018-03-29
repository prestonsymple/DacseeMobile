import React, { PureComponent } from 'react'
import {
  Text, View
} from 'react-native'
export default class UserDetail extends PureComponent {
  render() {
    const {data} = this.props
    return (
      <View style={{paddingHorizontal:20,paddingTop:20,backgroundColor:'#fff'}}>
        <InfoCell cellname='Referrer Name' value={data.referral.fullName} />
        <InfoCell cellname='Join Date' value={data.joinedOn} />
        <InfoCell cellname='Contact N0.' value={data.phoneCountryCode? (data.phoneCountryCode+ ' '+data.phoneNo):'' } />
        <InfoCell cellname='Downline Level' value={data.level} />
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
        <Text style={{color:'#ccc',fontSize:15}}>{cellname}</Text>
        <Text style={{color:'#000',fontSize:15}}>{value}</Text>
      </View>
    )
  }
}

