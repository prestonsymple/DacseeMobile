import React, { PureComponent } from 'react'
import { View, WebView } from 'react-native'

/*****************************************************************************************************/
/*****************************************************************************************************/

export default class WebViewComponent extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params
    return {
      title
    }
  }
  
  render() {
    const { source } = this.props.navigation.state.params
    return (
      <View style={{ flex: 1 }}>
        <WebView source={source} />
      </View>
    )
  }

}