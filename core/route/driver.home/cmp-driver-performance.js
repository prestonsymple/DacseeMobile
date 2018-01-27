// Boilerplate
import React from 'react';
import { View, Text, Image } from 'react-native';
import { AppProvider } from '../../providers';

// Construct Component
const ItemCont = ({ icon, pts = 0.0, label }) => {
  // Default Component Styles
  const styles = {
    contStyle: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dcIcon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      opacity: 0.15,
    },
    dcDisplay: {
      width: '100%',
      textAlign: 'center',
      fontSize: 55,
      lineHeight: 55,
      fontWeight: '700',
      color: 'rgba(0, 0, 0, 0.75)',
      marginBottom: 5
    },
    dcCaption: {
      width: '100%',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.55)'
    }
  };

  // Props Assign
  const {
    contStyle,
    dcIcon,
    dcDisplay,
    dcCaption
  } = styles;

  return (
    <View style={contStyle}>
      <Image source={icon} style={dcIcon}/>
      <Text style={dcDisplay}>{parseFloat(pts, 10).toFixed(1)}</Text>
      <Text style={dcCaption}>{label}</Text>
    </View>
  );
};

const DriverPerform = ({
  cancelPts,
  ratingPts,
  acceptPts

}) => {
  // Default Component Styles
  const styles = {
    contStyle: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    }
  };

    // Props Assign
  const {
    contStyle,
  } = styles;


    // Component Structure
  return (
    <View style={contStyle}>
      <ItemCont icon={AppProvider.resources.image.perf_1_icon} pts={cancelPts} label="Cancellation"/>
      <ItemCont icon={AppProvider.resources.image.perf_2_icon} pts={ratingPts} label="Rating"/>
      <ItemCont icon={AppProvider.resources.image.perf_3_icon} pts={acceptPts} label="Acceptance"/>
    </View>
  );
};

// Export Component
export default DriverPerform;
