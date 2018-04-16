import React, { PureComponent, Component } from 'react'
import {
  Text, View, Image, TouchableOpacity, FlatList, Keyboard, TextInput, StyleSheet, Platform,LayoutAnimation,KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native'

import {Screen, Icons, Session, TextFont, Define, System} from '../../utils'
import {connect} from 'react-redux'
import {application} from '../../redux/actions'
const { height, width } = Screen.window

const toName = 'jacky'
const to_id = '5a79423ab2ccf66e117f1b7f' //此处从导航中获取
const avatar = 'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg'  //此处从导航中获取

class ChatWindow extends Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    title: toName
  }

  constructor(props){
    super(props)
    this.state = {
      messageContent:'',
      keyboardShow:false,
      keyboardHeight:0,
      visibleHeight:height,
      showVoice:false,
      xHeight:64,
      data:[
        {
          _id:1,
          from_id:'5ac2de564647815dd78dbb07',
          to_id:'5a79423ab2ccf66e117f1b7f',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "你好" }',
          time:'1523248652'
        },
        {
          _id:2,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好" }',
          time:'1523248662'
        },
        {
          _id:3,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
          time:'1523248662'
        },
        {
          _id:4,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
          time:'1523248662'
        },
        {
          _id:5,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
          time:'1523248662'
        },
        {
          _id:6,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "image", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
          time:'1523248662'
        }
      ]
    }
  }


  componentDidMount() {
    System.Platform.iOS && this._willShow()
    System.Platform.iOS && this._willHide()
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      this.chatList.scrollToEnd()
    })

  }

  componentWillUnmount() {
    System.Platform.iOS && this._willRemove()
    this.keyboardDidShowListener.remove()

  }

  _willShow() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {

      const visibleHeight = height - e.endCoordinates.height

      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing]
      ))

      this.setState({
        visibleHeight,xHeight:44
      })

      this.setState({keyboardHeight:e.endCoordinates.height,keyboardShow:true})
    })
  }

  _willHide() {
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing]
      ))
      this.setState({keyboardHeight:0,keyboardShow:false,visibleHeight:height,xHeight:64})
    })
  }


  _willRemove(){
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }





  _sendMessage() {
    const {messageContent,data} = this.state
    const {user} = this.props
    let newId = data[data.length-1]._id+1
    let content={}
    content.type = 'text'
    content.content = messageContent
    let msgSend={}
    msgSend.from_id=user._id
    msgSend._id=newId
    msgSend.to_id=to_id
    msgSend.avatar=avatar
    msgSend.content = JSON.stringify(content)
    data.push(msgSend)
    this.setState({data,messageContent:''})
    setTimeout(()=>this.chatList.scrollToEnd(),200)
  }

  _changeMethod(){
    this.setState({showVoice:!this.state.showVoice})
  }

  _changeText(e) {
    this.setState({messageContent:e})
  }

  render(){
    const {data,messageContent,xHeight,visibleHeight} = this.state
    const {user} = this.props
    return(
      <View style={Platform.OS==='android'?{flex:1}:{height:visibleHeight-(Define.system.ios.x?88:64)}}>
        <View style={{flex:1}}>
          <FlatList
            onLayout={()=>{}}           //勿删！
            ref={e => this.chatList = e}
            data={data}
            keyExtractor={(item, index)=>item._id}
            renderItem={({item,index}) =>(
              <ChatItem
                content={item}
                msgData={data}
                index={index}
                user={user}
              />
            )}
          />
        </View>
        <InputBar
          onMethodChange={this._changeMethod.bind(this)}
          showVoice={this.state.showVoice}
          onSubmitEditing={this._sendMessage.bind(this)}
          messageContent={messageContent}
          textChange={this._changeText.bind(this)}
          xHeight={xHeight}
        />
      </View>
    )
  }
}

class InputBar extends Component {

  render() {
    const { messageContent, onSubmitEditing = () => {},textChange = () => {}, onMethodChange = () => {}, showVoice, xHeight} = this.props

    return(
      <View style={[styles.commentBar, { height:  Define.system.ios.x ? xHeight: 44 }]} >
        <View style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
          <View style={{ width: (width - 36) * 0.1,height:34,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={onMethodChange} style={{width:34,height:34,justifyContent:'center',alignItems:'center',borderColor:'#ddd',borderWidth:0.8,borderRadius:17}}>
              { Icons.Generator.Material(showVoice?'keyboard':'mic', 20, '#bbb') }
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor:'#fff',borderRadius:4,borderColor:'#ddd',borderWidth:0.6,marginHorizontal:8}}
          >
            {showVoice?
              <TouchableOpacity>
                <View style={[ styles.commentBar__input,{justifyContent:'center',alignItems:'center'}]}>
                  <Text style={{fontWeight:'bold',fontSize:16,color:'#4d4d4d'}}>
                      按住 说话
                  </Text>
                </View>
              </TouchableOpacity> : <TextInput
                blurOnSubmit={false}
                returnKeyType='send'
                value={ messageContent }
                onSubmitEditing={onSubmitEditing}
                onKeyPress={(event) => {
                  console.log( event.nativeEvent.key)
                }}
                underlineColorAndroid='transparent'
                onChangeText={textChange}
                style={[ styles.commentBar__input ]}
              />
            }
          </View>
          {/*注释右边按钮*/}
          {/*<View style={{ width: (width - 36) * 0.2, alignItems:'center', justifyContent:'space-around', flexDirection:'row'}}>*/}
          {/*<TouchableOpacity>*/}
          {/*{ Icons.Generator.Awesome('smile-o', 32, '#bbb') }*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity>*/}
          {/*{ Icons.Generator.Ion('ios-add-circle', 32, '#bbb') }*/}
          {/*</TouchableOpacity>*/}
          {/*</View>*/}
        </View>
      </View>
    )
  }
}


class ChatItem extends Component {

  _renderContent=()=>{
    const {content} = this.props
    const msgContent = JSON.parse(content.content)
    switch (msgContent.type){
    case 'text':
      return <Text selectable={true} style={{lineHeight:20}} >{msgContent.content}</Text>
    case 'image':
      return <Image
        source={[{uri:msgContent.content, width: 30, height: 30}]}
        style={{width: 100,height:100,justifyContent:'center',alignItems:'center'}}
        resizeMode={'cover'}
      />
    }
  }

  render(){
    const {user,content} = this.props
    const isSelf = user._id===content.from_id
    return(
      <TouchableWithoutFeedback>
        <View style={[styles.chat, isSelf?styles.right:styles.left]} >
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={[{uri: isSelf?user.avatars[user.avatars.length-1].url:content.avatar, width: 30, height: 30}]}
              style={styles.avatar} />
          </TouchableOpacity>
          <View style={[styles.txtArea]}>
            {this._renderContent()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles= StyleSheet.create({
  commentBar: {
    width:width,
    backgroundColor:'#F8F8F8',
    borderTopWidth: 0.8,
    borderColor: '#DDD',
    alignItems:'center',
  },
  commentBar__input:{
    paddingHorizontal: 10,
    height:34,
    width:0.9*(width-36),
    padding:0
  },
  circle:{
    width:34,
    height:34,
    borderRadius:17,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#ddd',
    borderWidth:0.8,
  },
  chat: {
    marginHorizontal: 4,
    marginVertical: 10
  },
  right: {
    flexDirection: 'row-reverse',
  },
  left: {
    flexDirection: 'row',
  },
  txtArea: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    maxWidth: width - 160,
    backgroundColor: '#FFF',
    justifyContent:'center'
  },
  avatar: {
    marginHorizontal: 10,
    borderRadius: 20,
    width: 40,
    height: 40
  },
})


export default connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {}
}))(ChatWindow)