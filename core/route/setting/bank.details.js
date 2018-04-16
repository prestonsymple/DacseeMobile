

import React, { PureComponent, Component} from 'react'
import { View, TouchableOpacity, Image, Alert, Text, ActivityIndicator, DeviceEventEmitter, StyleSheet, ScrollView } from 'react-native'
import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import Settings from './settings'

import { application, account } from '../../redux/actions'
import { Icons, Screen, Session, Define } from '../../utils'

const { width } = Screen.window
class  BankDetails extends Component{
  static navigationOptions = ({ navigation }) => {
    const {title} = navigation.state.params
    return {
      drawerLockMode: 'locked-closed',
      title: title,
    }
  }

  render(){
    const {i18n, user, navigation} =this.props
    return(
      <View style={styles.container}>
        <View style={{paddingTop:16,paddingLeft:12}}>
          <Text>Bank details is for your withdrawal purposes</Text>
        </View>
        <Settings producer={[
          [{
            title: i18n.bank_name, type: 'text',
            value: user.bank_name || '',
            onPress: () => navigation.navigate('ProfileChangeAvatar',{i18n})
          },{
            title: i18n.bank_account, type: 'text',
            value: user.bank_account || '',
            onPress: () => navigation.navigate('ProfileChangeAvatar',{i18n})
          },{
            title: i18n.bank_holder_name, type: 'text',
            value: user.bank_holder_name || '',
            onPress: () => navigation.navigate('ProfileChangeAvatar',{i18n})
          }]
        ]}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f2f2f2'
  }
})



export default connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {}
}))(BankDetails)