// Boilerplate
import React from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';

// Construct Component
const DriverSection = ({
  onPress = null,
  children = null,
  label,
  style = {},
}) => {
  // Default Component Styles
  const styles = {
    contStyle: {
      width: '100%',
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderBottomWidth: 1,
    },
    labelStyle: {
      fontSize: 16,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.4)'
    }
  };

    // Props Assign
  const compStyles = {
    contStyle: Object.assign({}, styles.contStyle, style.contStyle || {}),
    labelStyle: Object.assign({}, styles.labelStyle, style.labelStyle || {}),
  };
  const {
    contStyle,
    labelStyle
  } = compStyles;


    // Component Structure
  return (
    <TouchableNativeFeedback disabled={!onPress}>
      <View style={contStyle}>
        <View style={{ width: '100%', marginBottom: 10 }}>
          <Text style={labelStyle}>{label}</Text>
        </View>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
};

// Export Component
export default DriverSection;
