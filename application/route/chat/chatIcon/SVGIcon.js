import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Svg, {Path} from 'react-native-svg'

export default class SVGIcon extends Component {

  static propTypes = {
    size:PropTypes.number,
    fill:PropTypes.array,
    path:PropTypes.array.isRequired
  }

  static defaultProps = {
    fill: ['#039FFC'],
    size: 40
  };

  render() {
    const { size, path, fill } = this.props
    return (
      <Svg
        width={size}
        height={size}
        viewBox={'0 0 1024 1024'}>
        {path.map((item,i)=>(
          <Path
            key={i}
            fill={fill[i] || fill[0]}
            d={item} />
        ))}
      </Svg>

    )
  }

}