import React, { PureComponent } from 'react'
import {
  Text, View, Image
} from 'react-native'
export default class UserDetail extends PureComponent {
  render() {
    const {data}=this.props
    const { userId,fullName,avatars } = data
    return (
      <View style={{backgroundColor: '#1AB2FD',paddingBottom:10}}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <View style={[
            { backgroundColor: '#eee', overflow: 'hidden', borderColor: '#e8e8e8', borderWidth: 1 },
            { borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}
          ]}>
            <Image style={{ width: 80, height: 80 }} source={{ uri: avatars[avatars.length - 1].url }} />
            {/* { Icons.Generator.Material('account-circle', 100, '#fad723') } */}
          </View>
          <View style={{justifyContent:'center',marginLeft:15}}>
            <Text style={{color:'#fff',fontSize:25}}>{fullName}</Text>
            <Text style={{color:'#ccc',fontSize:14}}>{userId?('User ID：'+userId):''}</Text>
          </View>
        </View>
      </View>
    )
  }
}

