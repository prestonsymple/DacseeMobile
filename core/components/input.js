import React, { Component } from 'react'
import { TextInput,Platform } from 'react-native'


export default class Input extends Component {

    /* TODO: ADD PROPS TYPE */

    render() {
        const { props } = this
        return Platform.select({
            ios: (
                <TextInput  {...props}
                    //allowFontScaling={false}
                    holderTextColor={'#dbdbdd'}/>

            ),
            android: (<TextInput  {...props}
                    //allowFontScaling={false}
                    underlineColorAndroid='transparent'
                    holderTextColor={'#dbdbdd'}/>
            )
        })
    }
}
