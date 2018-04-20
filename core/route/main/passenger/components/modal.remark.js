/**
 * modal.remark
 * Created by yml on 2018/04/20.
 */
import React, { Component, PureComponent } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native'
import { Screen, Icons, Define, Session, UtilMath, TextFont } from '../../../../utils'
import Resources from '../../../../resources'
const { height, width } = Screen.window
export default class RemarkModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remark: ''
    }
  }
  render() {
    let modalHeight = Define.system.ios.x ? 242 + 22 : 360
    const { visible, i18n } = this.props
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.remarkChange()}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(57, 56, 67, 0.4)' }}>

          <View style={{ height: modalHeight, width: modalHeight - 40 }}>
            <Image style={{ height: 80, position: 'absolute', left: 10, top: 0, zIndex: 1 }} source={Resources.image.book_page} />
            <View style={{ height: 40, marginTop: 40, backgroundColor: '#FDC377', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: modalHeight - 40 }} />
            <View style={{ flex: 1, padding: 15, backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
              <View style={{ flex: 1, }}>
                <Text style={{ color: '#000', fontSize: TextFont.TextSize(17), marginBottom: 5 }}>{'备注'}</Text>
                <Text style={{ color: '#ccc', fontSize: TextFont.TextSize(14) }}>{'留下一段描述'}</Text>
                <TextInput  {...Define.TextInputArgs} multiline={true} onChangeText={text => { this.setState({ remark: text }) }}
                  style={{ backgroundColor: '#f1f1f1', textAlignVertical: 'top', paddingHorizontal: 8, flex: 1, marginTop: 15, borderRadius: 10 }} underlineColorAndro />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.props.remarkChange()}
                  activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.remarkChange(this.state.remark)}
                  activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.confirm}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ height: 60 }} />
        </View>
      </Modal >
    )
  }

}