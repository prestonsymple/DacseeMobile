import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, ScrollView, Platform
} from 'react-native'
import { connect } from 'react-redux'
import lodash from 'lodash'

import { booking } from '../../../redux/actions'
import { FormattedMessage } from 'react-intl'

const DEFAULT_MENU = [{
  title: 'taxi', key: 'taxi'
}, {
  title: 'mycircle', key: 'circle'
}, {
  title: 'preferred', key: 'standard'
}, {
  title: 'economy', key: 'eco'
}, {
  title: 'special', key: 'lux'
}]

export default connect(state => ({
  selected_type: state.booking.type,
  locale: state.intl.locale
}))(class HeaderSection extends Component {

  constructor(props) {
    super(props)
    this.state = {
      menu: DEFAULT_MENU
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.locale !== props.locale) {
      this.setState({ menu: lodash.cloneDeep(DEFAULT_MENU) })
    }
  }

  render() {
    const { selected_type } = this.props

    return (
      <View style={[
        { position: 'absolute', top: 0, left: 0, right: 0, height: 34 },
        Platform.select({
          ios: { backgroundColor: '#1AB2FD' },
          android: { backgroundColor: '#1AB2FD' }
        }),
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 }
      ]}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ height: 34 }}>
          {
            this.state.menu.map((pipe, index) => (
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.dispatch(booking.passengerSetValue({ type: pipe.key }))} key={index} style={{ paddingHorizontal: 10, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={selected_type === pipe.key ? { color: 'white', fontSize: 13, fontWeight: '600' } : { color: 'white', fontSize: 13, fontWeight: '600', opacity: .7  }}>
                  <FormattedMessage id={ pipe.title } />
                </Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    )
  }
})