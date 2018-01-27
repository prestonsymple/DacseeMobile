// Boilerplate
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableNativeFeedback } from 'react-native';
import { IQRCirBtn } from '../../../components';
import { AppProvider } from '../../../providers';

// Component Wrapper
const UploadField = ({ label, caption, status, extraBtnLabel, onPress }) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    fLabel: {
      width: '100%',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.65)'
    },
    fCaption: {
      fontSize: 14,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.45)',
      width: '100%',
      textAlign: 'left'
    },
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 20
    },
    dcBtn: {
      height: 50,
      width: 50,
      borderRadius: 100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    btnCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 5
    },
    dcBtn2: {
      height: 35,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      paddingLeft: 25,
      paddingRight: 25,
    },
    dcIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain'
    }
  });

  // Props Assign
  const {
    fLabel,
    fCaption,
    dcCol,
    dcBtn,
    btnCont,
    dcBtn2,
    dcIcon
  } = styles;

  // Component Structure
  return (
    <View style={dcCol}>
      <View style={{ flex: 1, paddingRight: 15 }}>
        <Text style={fLabel}>{label}</Text>
        <Text style={fCaption}>{caption}</Text>
        {extraBtnLabel && (
          <View style={btnCont}>
            <TouchableNativeFeedback>
              <View style={dcBtn2}>
                <Text>{extraBtnLabel}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        )}
      </View>
      {status === 'upload' && (
        <View style={dcBtn}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={dcIcon} source={AppProvider.resources.image.upload_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
      {status === 'completed' && (
        <View style={[dcBtn, {
          borderWidth: 0,
          backgroundColor: AppProvider.configs.ui.acceptColor
        }]}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={dcIcon} source={AppProvider.resources.image.complete_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
      {status === 'pending' && (
        <View style={[dcBtn, {
          borderWidth: 0,
          backgroundColor: AppProvider.configs.ui.main
        }]}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={dcIcon} source={AppProvider.resources.image.pending_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
      {status === 'reject' && (
        <View style={[dcBtn, {
          borderWidth: 0,
          backgroundColor: AppProvider.configs.ui.rejectColor
        }]}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={dcIcon} source={AppProvider.resources.image.close_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
      {status === 'view' && (
        <View style={dcBtn}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={dcIcon} source={AppProvider.resources.image.search_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
      {status === 'question' && (
        <View style={dcBtn}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
            onPress={onPress}
            disabled={status === 'completed'}
          >
            <View style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              <Image style={[dcIcon, { opacity: 0.3 }]} source={AppProvider.resources.image.complete_icon}/>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}

    </View>
  );
};

// Export Component
export default UploadField;
