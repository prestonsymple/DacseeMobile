import React, { PureComponent } from 'react'
import {
  Text, View, Image,ListView,TouchableOpacity
} from 'react-native'
import {TextFont} from '../../../utils'
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
export default class UserList extends PureComponent {
  render() {
    const { users } = this.props
    return (
      <View style={{paddingHorizontal:20,flex:1}}>
        <Text style={{fontSize:TextFont.TextSize(15),fontWeight:'bold',color:'#404040',marginVertical:10}}>DownLine Listing</Text>
        <ListView
          dataSource={dataContrast.cloneWithRows(users)}
          enableEmptySections={true}
          style={{ flex: 1 }}
          renderRow={(row,key,index) => {
            return (
              <TouchableOpacity key={key}  activeOpacity={.7}
                onPress={this.props.goUserDetails.bind(this,row._id)}>
                {index==0?<View/>:<View style={{height:0.5,backgroundColor:'#ccc'}}/>}
                <UserCell itemData={row} />
              </TouchableOpacity>
            )}}
        />
      </View>
    )
  }
}

class UserCell extends PureComponent {
  render(){
    const { itemData } = this.props
    const { fullName, userId, avatars, totalDownline } = itemData
    return(
      <View style={{ paddingVertical: 10,  flexDirection: 'row',justifyContent:'space-between',alignItems: 'center' }}>
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <View style={[
            { backgroundColor: '#eee',marginRight:10, overflow: 'hidden', borderColor: '#e8e8e8', borderWidth: 1 },
            { borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }
          ]}>
            <Image style={{ width: 50, height: 50 }} source={{uri:avatars?avatars[avatars.length - 1].url:'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'}} />
          </View>
          <View style={{justifyContent:'center',}}>
            <Text style={{color:'#000'}}>{fullName}</Text>
            <Text style={{color:'#ccc'}}>{userId?('User ID：'+userId):''}</Text>
          </View>
        </View>
        <Text style={{color:'#000'}}>{totalDownline+' Downlines'}</Text>
      </View>
    )
  }
}
