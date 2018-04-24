import React, { PureComponent, Component } from 'react'
import {
  Text, View, Image, TouchableOpacity, FlatList, Keyboard, TextInput, StyleSheet, Platform,LayoutAnimation,KeyboardAvoidingView,
  TouchableWithoutFeedback,TouchableHighlight
} from 'react-native'

import {Screen, Icons, Session, TextFont, Define, System} from '../../utils'
import {connect} from 'react-redux'
import {application} from '../../redux/actions'
import Voice from './voice.modal'
const { height, width } = Screen.window
import Sound from 'react-native-sound'
const toName = 'jacky'
const to_id = '5a79423ab2ccf66e117f1b7f' //此处从导航中获取
const avatar = 'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg'  //此处从导航中获取
class ChatWindow extends PureComponent {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    title: toName
  }

  constructor(props){
    super(props)
    this.time=null
    this.state = {
      messageContent:'',
      listVisibleHeight:0,
      keyboardShow:false,
      keyboardHeight:0,
      visibleHeight:height,
      showVoice:false,
      xHeight:20,
      saveChangeSize:0,
      inputChangeSize:0,
      voiceLength:0,
      voiceEnd:false,
      data:[
        {
          _id:1,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "你好www.baidu.com" }',
          time:'1523248662'
        },
        {
          _id:2,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg你1好" }',
          time:'1523248662'
        },
        {
          _id:3,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "你好你好你好你好你好www.baidu.com你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好" }',
          time:'1523248662'
        },
        {
          _id:4,
          from_id:'5ac2de564647815dd78dbb07',
          to_id:'5a79423ab2ccf66e117f1b7f',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "text", "content": "www.baidu.com" }',
          time:'1523248652'
        },

        {
          _id:5,
          from_id:'5a79423ab2ccf66e117f1b7f',
          to_id:'5ac2de564647815dd78dbb07',
          avatar:'https://storage.googleapis.com/dacsee-service-user/5a79423ab2ccf66e117f1b7f/1522737857978_avatar.jpeg',
          content:'{"type": "voice", "content": "/Users/joe/Library/Developer/CoreSimulator/Devices/895029F4-B29A-432E-8E87-72FAB6CA4942/data/Containers/Data/Application/B4005FAE-F04E-465F-9DCF-164FCA1812F1/Documents/test.aac","len":"14" }',
          time:'1523248662'
        },
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
    System.Platform.iOS && this._willShow()
    System.Platform.iOS && this._willHide()
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      this.time && clearTimeout(this.time)
      this.time = setTimeout(()=>this.chatList.scrollToEnd({animated:true}),500)
      // this.chatList.scrollToEnd({animated:true})
    })
    this.chatList.scrollToEnd({animated:true})
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
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.height
      ))

      this.setState({
        visibleHeight,xHeight:0,keyboardHeight:e.endCoordinates.height,keyboardShow:true
      })
      this.chatList.scrollToEnd({animated:true})
      // this.setState({keyboardHeight:e.endCoordinates.height,keyboardShow:true})
    })
  }

  _willHide() {
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.height
      ))
      this.setState({keyboardHeight:0,keyboardShow:false,visibleHeight:height,xHeight:20})
    })
  }


  _willRemove(){
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  _sendMessage(type,messageContent,voiceLen='') {
    if(type=='text' && messageContent.trim().length == 0 ){
      return
    }
    const {data} = this.state
    const {user} = this.props
    const len = data.length
    let newId = len>0?data[len-1]._id+1:1
    let content={}
    content.type = type
    content.content = messageContent
    if(voiceLen>=1) content.len=voiceLen
    let msgSend={}
    msgSend.from_id=user._id
    msgSend._id=newId
    msgSend.to_id=to_id
    msgSend.avatar=avatar
    msgSend.content = JSON.stringify(content)
    data.push(msgSend)
    this.setState({data,messageContent:''})
    this.time && clearTimeout(this.time)
    this.time = setTimeout(()=>this.chatList.scrollToEnd({animated:true}),200)
  }

  _changeMethod(){
    this.setState({showVoice:!this.state.showVoice})
    this.setState({saveChangeSize:this.state.inputChangeSize})
    this.time && clearTimeout(this.time)
    this.time = setTimeout(()=>this.InputBar.input && this.InputBar.input.focus(),300)
  }

  _changeText(e) {
    this.setState({messageContent:e})
  }

  _jump(url) {
    const {navigation,i18n} = this.props
    let safeUrl = this._safeUrl(url)
    navigation.navigate('SettingWetView', {
      title: '',
      source: { uri: safeUrl }
    })
  }

  _safeUrl(url){
    if (url.indexOf('https') == 0) return url
    if (url.indexOf('http') == 0) return url.replace('http://', 'https://')
    if (url.indexOf('http') == -1 ) return 'https://'+url
  }

  _onContentSizeChange(e) {
    const changeHeight = e.nativeEvent.contentSize.height
    if(changeHeight==34) return
    this.setState({inputChangeSize: changeHeight<=70?changeHeight:70})
    this.chatList.scrollToEnd({animated:true})
  }

  _onVoiceStart(e) {
    this.voice.show('normal')
    this.setState({voiceEnd:true})
  }

  _onVoiceEnd() {
    this.voice.close()
    this.setState({voiceEnd:false})
  }

  _watch(){

  }

  //TODO
  _PressAvatar(){
    // this.props.navigation.navigate('FriendsDetail', { i18n,...data })
  }

  _playVoice(_path) {
    let sound = new Sound(_path, '', (error) => {
      if (error) {
        console.log('failed to load the sound', error)
        return
      } else {
        console.log('duration in seconds: ' + sound.getDuration())
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing')
          } else {
            console.log('playback failed due to audio decoding errors')
          }
        })
      }
    })
  }

  render(){
    const {data,messageContent,xHeight,visibleHeight,footerY,listVisibleHeight,voiceEnd,inputChangeSize} = this.state
    const {user} = this.props
    return(
      <View style={Platform.OS==='android'?{flex:1}:{height:visibleHeight-(Define.system.ios.x?88:64)}}>
        <View style={{flex:1}}>
          <FlatList
            onLayout={(e)=>{this.setState({listVisibleHeight:e.nativeEvent.layout.height})}}           //勿删！
            ref={e => this.chatList = e}
            data={data}
            keyExtractor={(item, index)=>item._id}
            renderItem={({item,index}) =>(
              <ChatItem
                ref={e => this.chatItem = e}
                content={item}
                msgData={data}
                index={index}
                user={user}
                play={(_path) => this._playVoice(_path)}
                jump={(url) => this._jump(url)}
              />
            )}
          />
        </View>
        <InputBar
          ref={e => this.InputBar = e}
          onMethodChange={this._changeMethod.bind(this)}
          showVoice={this.state.showVoice}
          onSubmitEditing={(type,content) => this._sendMessage(type,content)}
          messageContent={messageContent}
          textChange={this._changeText.bind(this)}
          onContentSizeChange={this._onContentSizeChange.bind(this)}
          xHeight={xHeight}
          voiceStart={this._onVoiceStart.bind(this)}
          voiceEnd={this._onVoiceEnd.bind(this)}
          isVoiceEnd={voiceEnd}
          inputChangeSize={inputChangeSize}
        />
        <Voice
          ref={(e)=> this.voice=e}
          sendVoice={(type,content,voiceLen) => this._sendMessage(type,content,voiceLen)}
        />
      </View>
    )
  }
}

class InputBar extends Component {

  render() {
    const {
      messageContent,
      onSubmitEditing = () => {},
      textChange = () => {}, onMethodChange = () => {}, onContentSizeChange= () => {}, del= () =>{}, voiceStart = () => {},voiceEnd = () => {},
      showVoice,
      xHeight,
      isVoiceEnd,
      inputChangeSize
    } = this.props
    return(
      <View style={[styles.commentBar,{paddingBottom:Define.system.ios.x?xHeight:0}]} >
        <View style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
          <View style={{ width: (width - 36) * 0.1,height:34,justifyContent:'center',alignItems:'center'}} activeOpacity={.7}>
            <TouchableOpacity onPress={onMethodChange} style={{width:34,height:34,justifyContent:'center',alignItems:'center',borderColor:'#ddd',borderWidth:0.8,borderRadius:17}}>
              { Icons.Generator.Material(showVoice?'keyboard':'mic', 20, '#bbb') }
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor:'#fff',borderRadius:4,borderColor:'#ddd',borderWidth:0.6,marginHorizontal:8,justifyContent:'center'}}
          >
            {showVoice?
              <TouchableHighlight onPressIn={voiceStart} onPressOut={voiceEnd} activeOpacity={.7} underlayColor={'#eee'}>
                <View style={[{justifyContent:'center',alignItems:'center',width:0.7*(width-36),height:35,flexDirection:'row'}]}>
                  { Icons.Generator.Ion('ios-mic-outline', 20, '#bbb') }
                  <Text style={{fontSize:16,color:'#4d4d4d',marginLeft:10}}>
                    {isVoiceEnd?'松开 结束':'按住 说话'}
                  </Text>
                </View>
              </TouchableHighlight> : <TextInput
                ref={e=>this.input=e}
                multiline = {true}
                blurOnSubmit={false}
                value={ messageContent }
                onContentSizeChange={onContentSizeChange}
                underlineColorAndroid='transparent'
                onChangeText={textChange}
                style={[ styles.commentBar__input,{height:Math.max(35,inputChangeSize),  paddingHorizontal:8,paddingTop:System.Platform.iOS?7:0}]}
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
          <View style={{ width: (width - 36) * 0.2, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity style={{paddingHorizontal:15,paddingVertical:8,backgroundColor:'#7ED321',borderRadius:4}} onPress={onSubmitEditing.bind(this,'text',messageContent)} activeOpacity={.7}>
              <Text style={{color:'#fff'}}>发送</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const PATTERNS = {
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
}
class ChatItem extends Component {

  state={
    contentWidth:undefined
  }
  _renderContent=()=>{
    const {content, play=()=>{}, user, jump=() =>{}} = this.props
    const isSelf = user._id===content.from_id
    const msgContent = JSON.parse(content.content)
    let normal = '((https|http|ftp|rtsp|mms)?://)'
    let ftp = '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?'
    let ip = '(([0-9]{1,3}.){3}[0-9]{1,3}'
    let domain = '|([0-9a-z_!~*\'()-]+.)*'
    let secDomain = '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].'
    let levDomain = '[a-z]{2,6})'
    let port = '(:[0-9]{1,4})?'
    let slash = '((/?)|(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)'
    let reg = PATTERNS.url
    // let strRegex = '((https|http|ftp|rtsp|mms)?://)'
    //   + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
    //   + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
    //   + '|' // 允许IP和DOMAIN（域名）
    //   + '([0-9a-z_!~*\'()-]+\.)*' // 域名- www.
    //   + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
    //   + '[a-z]{2,6})' // first level domain- .com or .museum
    //   + '(:[0-9]{1,4})?' // 端口- :80
    //   + '((/?)|' // a slash isn't required if there is no file name
    //   + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)'
    // let reg = new RegExp(strRegex)
    let resArr,splitArr,text,url = null
    if(msgContent.type==='text'){
      resArr = msgContent.content.match(reg)
      url = resArr && resArr[0]
      splitArr = resArr && msgContent.content.split(url)
      text=!splitArr?<View style={[styles.txtArea]}>
        <Text selectable={true} style={{lineHeight:20}}>{msgContent.content}</Text>
      </View>:<View style={[styles.txtArea]}>
        <Text selectable={true} style={{lineHeight:20}}>{splitArr[0]}<Text style={{color:'green'}} onPress={jump.bind(this,url)}>{url}</Text>{splitArr[1]}</Text>
      </View>
    }

    switch (msgContent.type){
    case 'text':
      return (text)
    case 'voice':
      return (
        <View style={{flexDirection:isSelf?'row-reverse':'row',}}>
          <TouchableOpacity style={styles.voiceArea} onPress={play.bind(this,msgContent.content)} activeOpacity={.7}>
            <View style={[{width:40+(msgContent.len>1?msgContent.len*2:0),alignItems:isSelf?'flex-end':'flex-start'},isSelf?{alignItems:'flex-end',marginRight:5}:{alignItems:'flex-start',marginLeft:5}]}>
              { isSelf ? Icons.Generator.Ion('logo-rss', 18, '#bbb',{style:{transform: [{ scaleX: -1 }]}}) : Icons.Generator.Ion('logo-rss', 18, '#bbb') }
            </View>
          </TouchableOpacity>
          <View style={{justifyContent:'flex-end'}}>
            <Text style={[{color:'#aaa',marginBottom:4,},isSelf?{marginRight:4}:{marginLeft:4}]}>
              {`${msgContent.len}"`}
            </Text>
          </View>
        </View>)
    }
  }

  render(){
    const {user,content, } = this.props
    const isSelf = user._id===content.from_id
    return(
      <TouchableWithoutFeedback>
        <View style={[styles.chat, isSelf?styles.right:styles.left]}  ref={(e)=>this.content=e} >
          <TouchableOpacity onPress={() => {}} activeOpacity={.7}>
            <Image
              source={[{uri: isSelf?user.avatars[user.avatars.length-1].url:content.avatar, width: 30, height: 30}]}
              style={styles.avatar} />
          </TouchableOpacity>
          <View style={[isSelf?styles.right:styles.left]}>
            <View style={[styles.triangle, isSelf?styles.right_triangle:styles.left_triangle]} />
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
    alignItems:'center'
  },
  commentBar__input:{
    // paddingHorizontal: 10,
    height:26,
    width:0.7*(width-36),
    padding:0,
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
    paddingHorizontal: System.Platform.iOS?10:6,
    paddingVertical:6,
    backgroundColor: '#FFF',
    justifyContent:'center',
    maxWidth:width-100,
    flexWrap:'wrap',
    minHeight:20
  },
  voiceArea: {
    borderRadius: 4,
    maxWidth: width - 160,
    backgroundColor: '#FFF',
    justifyContent:'center',
    minHeight:30
  },
  avatar: {
    marginHorizontal: 8,
    borderRadius:19,
    width: 38,
    height: 38
  },
  triangle:{
    width:0,
    height:0,
    borderWidth:8,
    borderColor:'#fff',
    borderTopColor:'transparent',
    borderBottomColor:'transparent',
    marginTop:12
  },
  left_triangle:{
    borderLeftWidth:0
  },
  right_triangle:{
    borderRightWidth:0
  }
})


export default connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {}
}))(ChatWindow)