/**
 * modal.remark
 * Created by yml on 2018/04/20.
 */
import React, { Component, PureComponent } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { booking } from '../../../../redux/actions'
import { Screen, Icons, Define, Session, UtilMath, TextFont } from '../../../../utils'
import Resources from '../../../../resources'
const { height, width } = Screen.window
export default connect(state => ({
  notes: state.booking.notes || ''
}))(class RemarkModel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      remark: props.notes
    }
  }

  componentWillReceiveProps(props) {
    if (props.notes !== this.props.notes) {
      this.setState({ remark: props.notes })
    }
  }

  render() {
    let modalHeight = width
    const { visible, i18n } = this.props
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.onClose()}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(57, 56, 67, 0.4)' }}>
          <KeyboardAvoidingView behavior='padding'>
            <View style={{ height: modalHeight, width: modalHeight - 60 }}>
              <Image style={{ height: 80, position: 'absolute', left: 10, top: 0, zIndex: 1 }} source={Resources.image.book_page} />
              <View style={{ height: 40, marginTop: 40, backgroundColor: '#FDC377', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: modalHeight - 60 }} />
              <View style={{ flex: 1, padding: 15, backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <View style={{ flex: 1, }}>
                  <Text style={{ color: '#000', fontSize: TextFont.TextSize(17), marginBottom: 5 }}>{i18n.remarks}</Text>
                  <Text style={{ color: '#ccc', fontSize: TextFont.TextSize(14) }}>{i18n.note_trip}</Text>
                  <TextInput defaultValue={this.state.remark}
                    {...Define.TextInputArgs} multiline={true}
                    clearTextOnFocus={false}
                    placeholder={i18n.remarks_apliction}
                    onChangeText={text => { this.setState({ remark: text }) }}
                    style={{ backgroundColor: '#f1f1f1', textAlignVertical: 'top', paddingHorizontal: 8, flex: 1, marginTop: 15, borderRadius: 10 }} underlineColorAndro />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 10, justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => this.props.onClose()}
                    activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.props.dispatch(booking.passengerSetValue({ notes: this.state.remark }))
                    this.props.onClose()
                  }} activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.confirm}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>

          <View style={{ height: 60 }} />
        </View>
      </Modal >
    )
  }

})