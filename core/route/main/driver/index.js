import React from 'react'
import { View } from 'react-native'

import { JobsListScreen } from '../../jobs'
import { Screen } from '../../../utils'
const { width } = Screen.window

export default class DriverComponent extends React.PureComponent {
  render() {
    return (
      <View style={{ width }}>
        <JobsListScreen />
      </View>
    )
  }
}