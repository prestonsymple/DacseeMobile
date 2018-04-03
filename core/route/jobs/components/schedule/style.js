import {StyleSheet} from 'react-native';
import platformStyles from './platform-style';

const STYLESHEET_ID = 'stylesheet.agenda.main';

export default function styleConstructor(theme = {}) {
  const { knob, weekdays } = platformStyles();
  return StyleSheet.create({
    knob,
    weekdays,
    header: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      position:'absolute',
      height:'100%',
      width:'100%',
    },
    calendar: {
      flex: 1,
      borderBottomWidth: 1,
      borderColor: '#e8e9ec'
    },
    knobContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: 'center',
      backgroundColor:'#ffffff'
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      fontSize: 13,
      color: '#b6c1cd',
    },
    reservations: {
      marginTop: 104,
      backgroundColor:'#f4f4f4'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
