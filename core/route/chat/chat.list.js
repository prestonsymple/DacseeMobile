import React, { PureComponent, Component } from 'react'
import {
  Text, View, Image, TouchableOpacity, FlatList, Keyboard, TextInput, StyleSheet, Platform,ScrollView,KeyboardAvoidingView,
  TouchableWithoutFeedback,Animated
} from 'react-native'

import { SafeAreaView} from 'react-navigation'
import {Screen, Icons, Session, TextFont, Define} from '../../utils'
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
      listHeight:0,
      bounceValue: new Animated.Value(0),
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
        // {
        //   _id:3,
        //   from_id:'5a79423ab2ccf66e117f1b7f',
        //   to_id:'5ac2de564647815dd78dbb07',
        //   avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
        //   content:'{"type": "image", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
        //   time:'1523248662'
        // },
        // {
        //   _id:4,
        //   from_id:'5a79423ab2ccf66e117f1b7f',
        //   to_id:'5ac2de564647815dd78dbb07',
        //   avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
        //   content:'{"type": "image", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
        //   time:'1523248662'
        // },
        // {
        //   _id:5,
        //   from_id:'5a79423ab2ccf66e117f1b7f',
        //   to_id:'5ac2de564647815dd78dbb07',
        //   avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
        //   content:'{"type": "image", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
        //   time:'1523248662'
        // },
        // {
        //   _id:6,
        //   from_id:'5a79423ab2ccf66e117f1b7f',
        //   to_id:'5ac2de564647815dd78dbb07',
        //   avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
        //   content:'{"type": "image", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg" }',
        //   time:'1523248662'
        // }
      ]
    }
  }


  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      this.setState({keyboardHeight:e.endCoordinates.height,keyboardShow:true})
    })
    this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      this.chatList.scrollToEnd()
    })

    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
      this.setState({keyboardHeight:0,keyboardShow:false})
    })
  }

  componentWillUnmount() {
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

  // _changeHeight = () => {
  //   const {keyboardShow, keyboardHeight} = this.state
  //   let showCompare = Define.system.ios.x ? height - 88 - 49 : height - 64 - 49
  //   let compare = Define.system.ios.x ? height - 88 - 89 : height - 64 - 49
  //   if (Platform.OS === 'ios') {
  //     if (keyboardShow) {
  //       return {height: showCompare - keyboardHeight}
  //     } else {
  //       return {height: compare}
  //     }
  //   }else{
  //     return{flex:1}
  //   }
  // }

  // _contentBarHeight = () => {
  //   const {keyboardShow,keyboardHeight} = this.state
  //   if(keyboardShow){
  //     return{height:49+keyboardHeight}
  //   }else{
  //     let newHeight = Define.system.ios.x?89:49
  //     return { height:newHeight }
  //   }
  // }

  render(){
    const {data,listHeight} = this.state
    // let newData = [...data]
    // const invertData= listHeight>400?newData.sort((a,b)=>b._id-a._id):data

    const {user} = this.props
    return(
      <View style={{flex:1}}>
        <FlatList
          onScroll={(e)=>{console.log(e.nativeEvent)}}
          keyboardDismissMode={'on-drag'}
          ref={e => this.chatList = e}
          onLayout={(event)=>{}}   //勿删
          data={data}
          keyExtractor={(item, index)=>item._id}
          renderItem={({item,index}) =>(
            <ChatItem
              content={item}
              msgData={data}
              index={index}
              user={user}
              navigation={this.props.navigation}
              listHeight={listHeight}
            />
          )}
        />
        <ChatBar onSubmitEditing={this._sendMessage.bind(this)} messageContent={this.state.messageContent} />
      </View>
    )
  }
}

class ChatBar extends Component {

  render() {
    const { messageContent, onSubmitEditing = () => {}, bounceValue, keyboardHeight } = this.props
    const WrapView = Platform.OS === 'android' ? (View) : (KeyboardAvoidingView)
    const setter = Platform.select({
      ios: { behavior: 'position', keyboardVerticalOffset: Define.system.ios.x ? 72 : 64 },
      android: { /* props */ }
    })

    return(
      <WrapView {...setter}>
        <View style={[styles.commentBar, { height: 64 }]} >
          <View style={{flexDirection:'row',alignItems:'center',marginVertical:7}}>
            <View style={{backgroundColor:'#fff',borderRadius:4,borderColor:'#ddd',borderWidth:0.6,marginHorizontal:8}}>
              <TextInput
                ref={e => this.chat = e}
                blurOnSubmit={false}
                returnKeyType='send'
                value={ messageContent }
                onSubmitEditing={onSubmitEditing}
                underlineColorAndroid='transparent'
                onChangeText={(messageContent) => this.setState({ messageContent })}
                style={[ styles.commentBar__input ]}
                placeholder={'发送'}/>
            </View>
            <View style={{ width: (width - 36) * 0.2, alignItems:'center', justifyContent:'space-around', flexDirection:'row' }}>
              <TouchableOpacity>
                { Icons.Generator.Awesome('smile-o', 32, '#bbb') }
              </TouchableOpacity>
              <TouchableOpacity>
                { Icons.Generator.Ion('ios-add-circle', 32, '#bbb') }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </WrapView>
    )
  }
}


class ChatItem extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      footerY: ''
    }
  }

  _renderContent=()=>{
    const {content} = this.props
    const msgContent = JSON.parse(content.content)
    switch (msgContent.type){
    case 'text':
      return <Text selectable={true}>{msgContent.content}</Text>
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
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    backgroundColor:'#F8F8F8',
    borderTopWidth: 0.8,
    borderColor: '#DDD',
    alignItems:'center',
  },
  commentBar__input:{
    paddingHorizontal: 10,
    height:34,
    width:0.8*(width-36),
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