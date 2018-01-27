// Boilerplate
import React from 'react';
import { View, Text } from 'react-native';
import { IQRCirBtn } from '../../components';
import { AppProvider } from '../../providers';

// Construct Component
const DriverWallet = ({
  currency,
  value
}) => {
  // Default Component Styles
  const styles = {
    contStyle: {
      width: '100%',
      paddingLeft: 10,
      paddingRight: 10,
    },
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10,
      paddingTop: 10,
    },
    dataCont: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginRight: 10
    },
    fCurrency: {
      fontSize: 14,
      lineHeight: 15,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.4)',
      marginRight: 5
    },
    fTitle: {
      fontSize: 35,
      lineHeight: 35,
      fontWeight: '900',
      color: 'rgba(0, 0, 0, 0.75)'
    }
  };

    // Props Assign
  const {
    contStyle,
    dcCol,
    dataCont,
    fCurrency,
    fTitle
  } = styles;

    // Component Structure
  return (
    <View style={contStyle}>
      <View style={dcCol}>
        <View style={dataCont}>
          <Text style={fCurrency}>{currency.toUpperCase()}</Text>
          <Text style={fTitle}>{parseFloat(value, 10).toFixed(2)}</Text>
        </View>
        <IQRCirBtn
          style={{
            contStyle: {
              backgroundColor: AppProvider.configs.ui.acceptColor,
              width: 45,
              height: 45,
            },
            iconStyle: {
              width: 25,
              height: 25,
            }
          }}
          icon={AppProvider.resources.image.add_icon}
        />
      </View>
    </View>
  );
};

// Export Component
export default DriverWallet;
