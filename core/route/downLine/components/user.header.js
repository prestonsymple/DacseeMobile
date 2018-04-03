import React, { PureComponent } from 'react'
import {
  Text, View, Image
} from 'react-native'
import { FormattedMessage } from 'react-intl'
import {TextFont} from '../../../utils'
export default class UserDetail extends PureComponent {
  render() {
    const {data}=this.props
    const { userId,fullName,avatars } = data
    return (
      <View style={{backgroundColor: '#1AB2FD',paddingBottom:20}}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <View style={[
            { backgroundColor: '#eee', overflow: 'hidden', borderColor: '#e8e8e8', borderWidth: 1 },
            { borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center'}
          ]}>
            <Image style={{ width: 80, height: 80 }} source={{ uri: avatars?avatars[avatars.length - 1].url:'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'}} />
            {/* { Icons.Generator.Material('account-circle', 100, '#fad723') } */}
          </View>
          <View style={{justifyContent:'center',marginLeft:15}}>
            <Text style={{color:'#fff',fontSize:TextFont.TextSize(25)}}>{fullName}</Text>
            <FormattedMessage id={'userid'}>
              {
                msg => (
                  <Text style={{color:'#ccc',fontSize:TextFont.TextSize(14)}}>{userId?(msg+'：'+userId):''}</Text>
                )
              }
            </FormattedMessage>            
          </View>
        </View>
      </View>
    )
  }
}

