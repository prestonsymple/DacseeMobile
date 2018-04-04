/* @flow */
/* global FormData */

import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Image, Alert, StatusBar, ActivityIndicator, DeviceEventEmitter } from 'react-native'
import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'


import { application, account } from '../../redux/actions'
import { Icons, Screen, Session, Define } from '../../utils'

const { width } = Screen.window

const PICKER_OPTIONS = {
  title: '相册',
  storageOptions: { skipBackup: true, path: 'images' },
  quality: 0.8,
  mediaType: 'photo',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '从手机相册选择',
  allowsEditing: true,
  noData: false,
  maxWidth: 1000,
  maxHeight: 1000,
  permissionDenied: {
    title: '无法访问', text: '请前往 设置 - Dacsee 中开启相机及相册权限',
    reTryTitle: '重试', okTitle: '好的'
  }
}

export default connect(state => ({ account: state.account }))(class ProfileChangeAvatarsScreen extends PureComponent {


  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.update_avatar,
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.PROFILE.CHANGE.AVATAR')}
        >
          {Icons.Generator.Material('more-horiz', 28, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#141518',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      media: {},
      uploading: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.PROFILE.CHANGE.AVATAR', () => this.ActionSheet.show())
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  _pressActionSheet(index) {
    if (index === 0) {
      ImagePicker.launchCamera(PICKER_OPTIONS, (response) => {
        if (response.didCancel) { 
          return 
        } else if (response.error) {
          let label = response.error.startsWith('Photo') ? '照片' : '相机'
          return Alert.alert(`请在iPhone的“设置-隐私-${label}”选项中，允许小苍兰访问你的${label}。`)
        } else {
          this.setState({ media: {
            id: `${(new Date).getTime()}`,
            uri: response.uri,
            feature: 'image'
          }})
          this.uploadImage(response.data)
        }
      })
    }

    if (index === 1) {
      ImagePicker.launchImageLibrary(PICKER_OPTIONS, (response) => {
        if (response.didCancel) { 
          return 
        } else if (response.error) {
          let label = response.error.startsWith('Photo') ? '照片' : '相机'
          return Alert.alert(`请在iPhone的“设置-隐私-${label}”选项中，允许小苍兰访问你的${label}。`)
        } else {
          this.setState({ media: { 
            id: `${(new Date).getTime()}`,
            uri: response.uri,
            feature: 'image'
          } })
          this.uploadImage(response.data)
        }
      });
    }
  }

  async uploadImage(base64) {
    try {
      this.setState({ uploading: true })
      const data = await Session.User.Upload('v1/profile/avatar2', {
        data: `data:image/jpeg;base64,${base64}`
      })
      this.props.dispatch(account.setAccountValue({
        user: Object.assign({}, this.props.account.user, { avatars: data.avatars })
      }))
      this.props.dispatch(application.showMessage('头像已上传'))
    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器，请稍后重试'))
    } finally {
      this.setState({ uploading: false })
    }
  }

  render() {
    // const { _id, checked, friend_id, friend_info } = this.props.navigation.state.params
    // const { fullName, email, phoneCountryCode, phoneNo, userId, avatars } = friend_info
    const { avatars } = this.props.account.user
    const { media, uploading = false } = this.state

    return ( 
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#151416'} barStyle={'light-content'} />
        <View style={{ flex: 1, top: Define.system.ios.x ? -44 : -22, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: width, height: width }}>
            <Image style={{ width: width, height: width }} source={{ uri: media.uri || avatars[avatars.length - 1].url }} />
          </View>
        </View>
        {
          uploading && (
            <View style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
              <View style={{ top: Define.system.ios.x ? -44 : -22 }}>
                <ActivityIndicator size='small' color='#d0d0d0' />
              </View>
            </View>
          )
        }
        <ActionSheet
          ref={e => this.ActionSheet = e}
          options={['拍照', '从手机相册中选择', '取消']}
          cancelButtonIndex={2}
          onPress={this._pressActionSheet.bind(this)}
        />
      </View>
    )
  }yaen
})