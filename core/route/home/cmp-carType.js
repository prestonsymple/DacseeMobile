import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableNativeFeedback } from 'react-native';

import { AppProvider } from '../../providers';

class CarTypeCard extends Component {
  state = {
    selectedCar: 'Standard'
  };

  /*****
   Custom Style
   *****/
  styles = StyleSheet.create({
    bodyCard: {
      width: '100%',
      borderRadius: 5,
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: 'white',
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10,
    },
    dcCol: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 5
    },
    fTitle: {
      fontSize: 16,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.75)',
      flex: 1,
      textAlign: 'left'
    },
    carCont: {
      flex: 1,
      height: 65,
      resizeMode: 'cover',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      borderRadius: 5,
      margin: 2,
      backgroundColor: '#c2c2c2'
    },
    carTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: 'rgba(0, 0, 0, 0.75)',
      marginBottom: 3
    }
  });

  /*****
   custom event handlers
   *****/
  changeTab(selectedCar) {
    this.setState({ selectedCar });
  }

  /*****
   react-native events
   *****/
  carTabRender({ label, img }) {
    const { selectedCar } = this.state;
    const {
      carCont,
      carTitle
    } = this.styles;
    return (
      <Image style={[carCont, selectedCar === label && { backgroundColor: AppProvider.configs.ui.sec }]} source={img}>
        <TouchableNativeFeedback onPress={() => this.changeTab(label)}>
          <View style={{ flex: 1, width: '100%', padding: 10 }}>
            <Text style={carTitle}>{label.toUpperCase()}</Text>
          </View>
        </TouchableNativeFeedback>
      </Image>
    );
  }

  render() {
    const {
      bodyCard,
      dcCol,
      fTitle,
    } = this.styles;

    return (
      <View style={bodyCard}>
        <View style={dcCol}>
          <Text style={fTitle}>CAR TYPE</Text>
        </View>
        <View style={dcCol}>
          {this.carTabRender({ label: 'Standard', img: AppProvider.resources.image.standard_car })}
          {this.carTabRender({ label: 'Premium', img: AppProvider.resources.image.premium_car })}
          {this.carTabRender({ label: 'SUV', img: AppProvider.resources.image.suv_car })}
        </View>
      </View>
    );
  }
}

export default CarTypeCard;
