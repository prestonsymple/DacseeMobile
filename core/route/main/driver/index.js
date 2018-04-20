import React from 'react'
import { View } from 'react-native'

import { JobsOnlineScreen } from '../../jobs'
import { Screen } from '../../../utils'
const { width } = Screen.window

import { JobsAddScreen } from '../../jobs'

export default class DriverComponent extends React.PureComponent {
  render() {
    return (
      <View style={{ width }}>
        {/*<JobsOnlineScreen />*/}
        <JobsAddScreen />
      </View>
    )
  }
}
