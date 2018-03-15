// @flow
import React, { PureComponent, Component } from 'react'
import { StyleSheet, View, ListView, TouchableOpacity, Text, Switch, InteractionManager, Image } from 'react-native'
import { connect } from 'react-redux'
// import InteractionManager from 'InteractionManager'
import PropTypes from 'prop-types'

/*****************************************************************************************************/
import BaseComponent from '../_base'
import {
  Screen, Icons, Define
} from '../../utils'
// import {} from '../../components'
/*****************************************************************************************************/

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ 
  user: state.account.user
}))(class Settings extends BaseComponent {

  static propTypes = {
    producer: PropTypes.func
  }

  constructor(props: Object) {
    super(props)
    const data = dataContrast.cloneWithRowsAndSections(props.producer(props))
    this.state = {
      source: data
    }
    this.struct = {
      section: data.getSectionLengths(),
      // length: data.getSectionLengths().reduce((prev, next) => prev + next)
    }
  }

  componentWillReceiveProps(props) {
    console.log(props)
    const data = dataContrast.cloneWithRowsAndSections(props.producer(props))
    this.setState({ source: data })
    this.struct = {
      section: data.getSectionLengths(),
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  renderSeparator(sectionKey, row) {
    const { section } = this.struct
    // 判断最后一行，补下划线
    if (
      parseInt(sectionKey) === section.length - 1 &&
      parseInt(row) === section[sectionKey] - 1
    ) return (<View style={{ height: Define.FixPlusPixel, backgroundColor: '#E7EBF1' }} />)
    return (<View style={{ paddingLeft: 12, backgroundColor: 'white' }}><View style={{ height: Define.FixPlusPixel, backgroundColor: '#E7EBF1' }} /></View>)
  }

  renderSectionHeader(data, sectionID) {
    if (data[0].type === 'button') return React.createElement(View, { style: styles.sectionButtonBorder })
    if (parseInt(sectionID) === 0) return React.createElement(View, { style: [styles.sectionBorder, { borderTopWidth: 0 }] })
    return React.createElement(View, { style: styles.sectionBorder })
  }

  renderRow(data, section, index: number) {
    return React.createElement(ListViewItem, { data, section, index })
  }

  render() {
    const wrapProps = { style: { height: Screen.safaContent.height } }
    const viewProps = {
      style: styles.list,
      dataSource: this.state.source,
      stickySectionHeadersEnabled: false,
      renderRow: this.renderRow.bind(this),
      renderSectionHeader: this.renderSectionHeader.bind(this),
      renderSeparator: this.renderSeparator.bind(this)
    }

    return React.createElement(View, wrapProps, (<ListView {...viewProps} />))
  }
})

class ListViewItem extends Component {

  static propTypes = {
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['button', 'switch', 'text', 'image']),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object
      ]),
      onPress: PropTypes.func,
      editable: PropTypes.bool
    })
  }

  constructor(props) {
    super(props)
    this.state = { value: props.data.value }
  }

  _onSwitchValueChange(value) {
    const { onPress = () => {} } = this.props.data
    onPress(value)
    this.setState({ value: value })
  }

  render() {
    const {
      title = '',
      onPress = () => { },
      type = 'any',
      editable = true
    } = this.props.data
    const { value } = this.state

    const buttonProps = { onPress, activeOpacity: 0.7, style: styles.buttonWrap }
    if (type === 'button') return React.createElement(TouchableOpacity, buttonProps, <Text style={styles.buttonText}>{title}</Text>)

    if (type === 'switch') return (
      <View style={styles.itemTouchable}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={styles.itemRight}>
          <Switch value={value} onValueChange={this._onSwitchValueChange.bind(this)} />
          {/* {editable ? Icons.Generator.Material('chevron-right', 24, '#bbb') : null} */}
        </View>
      </View>
    )

    if (type === 'image') return (
      <TouchableOpacity onPress={editable ? onPress : () => { }} activeOpacity={0.7} style={styles.itemImageTouchable}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={styles.itemRight}>
          <Image style={{ width: 68, height: 68, borderRadius: 34 }} source={value} />
          {editable ? Icons.Generator.Material('chevron-right', 24, '#bbb') : null}
        </View>
      </TouchableOpacity>
    )

    return (
      <TouchableOpacity onPress={editable ? onPress : () => { }} activeOpacity={0.7} style={styles.itemTouchable}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={styles.itemRight}>
          <Text style={[styles.itemValue, { marginRight: editable ? 0 : 10 }]}>{value}</Text>
          {editable ? Icons.Generator.Material('chevron-right', 24, '#bbb') : null}
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  sectionButtonBorder: { height: 24, borderTopWidth: Define.FixPlusPixel, borderBottomWidth: Define.FixPlusPixel, borderColor: '#eaeaea' },
  sectionBorder: { height: 12, borderTopWidth: Define.FixPlusPixel, borderBottomWidth: Define.FixPlusPixel, borderColor: '#eaeaea' },
  itemTouchable: { paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white' },
  itemImageTouchable: { paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 92, backgroundColor: 'white' },
  itemValue: { color: '#666', fontSize: 15 },
  itemRight: { justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
  itemTitle: { color: '#333', fontSize: 15, fontWeight: '400' },
  buttonText: { color: '#333', fontSize: 15 },
  buttonWrap: { justifyContent: 'center', alignItems: 'center', height: 44, backgroundColor: 'white' },
  list: { flex: 1, backgroundColor: '#f2f2f2' },
})