import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

export default connect(state => ({ authToken: state.account.authToken }))(class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.props.navigation.navigate(this.props.authToken ? 'App' : 'Auth')
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
      </View>
    )
  }
})