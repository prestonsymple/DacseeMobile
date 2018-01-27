// Boilerplate
import React from 'react';
import { View, Text } from 'react-native';
import { IQRCirBtn } from '../../components';
import { AppProvider } from '../../providers';

// Helper Component
const ProgressBar = ({
  currency,
  value,
  totalDone = null,
  total = null,
  label = '',
  timeLeft = null
}) => {
  // Default Component Styles
  const styles = {
    contStyle: {
      width: '100%',
      paddingTop: 10,
    },
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    fTitle: {
      fontSize: 25,
      lineHeight: 25,
      fontWeight: '700',
      color: 'rgba(0, 0, 0, 0.75)',
    },
    fCaption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.45)'
    },
    outterBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: 10,
      borderRadius: 25,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      marginTop: 5,
      marginBottom: 5,
    },
    innerBar: {
      height: '100%',
      width: `${(parseFloat(totalDone, 10) / parseFloat(total, 10)) * 100}%`,
      backgroundColor: AppProvider.configs.ui.main,
      opacity: 0.5,
      borderRadius: 25
    }
  };

  // Props Assign
  const {
    contStyle,
    dcCol,
    fTitle,
    fCaption,
    outterBar,
    innerBar
  } = styles;

  // Component Structure
  return (
    <View style={contStyle}>
      <View style={dcCol}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <Text style={fTitle}>{totalDone}</Text>
          <Text style={fTitle}>/</Text>
          <Text style={{ ...fTitle, marginRight: 5 }}>{total}</Text>
          <Text style={fCaption}>{label.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Text style={{ ...fTitle, marginRight: 5 }}>{parseFloat(value, 10).toFixed(2)}</Text>
          <Text style={fCaption}>{currency.toUpperCase()}</Text>
        </View>
      </View>
      <View style={dcCol}>
        <View style={outterBar}>
          <View style={innerBar}/>
        </View>
      </View>
      <View style={{ ...dcCol, justifyContent: 'flex-end' }}>
        <Text style={fCaption}>{timeLeft.toUpperCase()} LEFT</Text>
      </View>
    </View>
  );
};

// Construct Component
const DriverComm = ({
  currency,
  value,
  totalDone,
  total,
  label,
  timeLeft
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
      marginRight: 10,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      paddingBottom: 10,
      borderBottomWidth: 2
    },
    fCurrency: {
      fontSize: 14,
      lineHeight: 15,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.4)',
      marginLeft: 5
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
      {/*<View style={dcCol}>*/}
        {/*<View style={dataCont}>*/}
          {/*<Text style={fTitle}>{parseFloat(value, 10).toFixed(2)}</Text>*/}
          {/*<Text style={fCurrency}>{currency.toUpperCase()}</Text>*/}
        {/*</View>*/}
      {/*</View>*/}
      <ProgressBar currency={currency} value={value} totalDone={totalDone} total={total} label={label} timeLeft={timeLeft}/>
    </View>
  );
};

// Export Component
export default DriverComm;
