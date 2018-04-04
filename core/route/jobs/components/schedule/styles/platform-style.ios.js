import {
  Platform
} from 'react-native';
export default function platformStyles() {
  return {
    knob: {
      width: 38,
      height: 7,
      marginTop: 10,
      borderRadius: 3,
      backgroundColor:  Platform.OS === 'ios' ? '#f2F4f5' : '#4ac4f7'
    },
    weekdays: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginLeft: 15,
      marginRight: 15,
      paddingTop: 15,
      paddingBottom: 7,
      backgroundColor: '#ffffff'
    },
  };
}
