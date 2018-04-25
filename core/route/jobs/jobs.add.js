/**
 * @flow
 * Created by Rabbit on 2018/4/20.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput, ScrollView, TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import Input from '../../components/input'

import {System, Screen, Define, Session} from '../../utils'

import AutoComplete from 'react-native-autocomplete-input'
import {application, account} from '../../redux/actions'
import {connect} from 'react-redux'

const { width, height } = Screen.window

export default connect(state => ({
  i18n: state.intl.messages || {},
  user: state.account.user,
}))(class JobsAdd extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.car_add_vehicle,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      carNumber: '',
      manufacturer: '',
      carModel: '',
      manufactureYear: '',
      color: '',

      manufacturerData: [],
      isManufacturerFocus: true,
      carModelData: [],
      isCarModelFocus: true,

      keyboardHeight: 0,

      iosBottomViewHeight: 85,
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
    if(System.Platform.iOS) {
      this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    }
    this.fetchData()
  }

  componentWillUnmount() {
    if (System.Platform.iOS) {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    }
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    // this.keyboardWillShowSub.remove()
    // this.keyboardWillHideSub.remove()
  }

  _keyboardDidShow(e){
    // this.setState({keyboardHeight: 216})
    // this.setState({
    //   isBottomViewHidden:true,
    //   keyboardHeight: 0
    // })

  }

  _keyboardDidHide(e){
    // this.setState({keyboardHeight: 0})
    // this.setState({
    //   isBottomViewHidden: false,
    //   keyboardHeight: 85
    // })
  }

  keyboardWillShow = (event) => {
    this.setState({keyboardHeight: event.endCoordinates.height, iosBottomViewHeight: 0})
  };

  keyboardWillHide = (event) => {
    this.setState({keyboardHeight: 0, iosBottomViewHeight: 85})
  };

  async fetchData() {
    try {
      //获取车辆类型
      let manufacturerData = await Session.Lookup.Get('v1/lookup/vehicleManufacturers')
      let dataArray = []
      manufacturerData.map(item => {
        dataArray.push(item.name)
      })

      this.setState({ manufacturerData: dataArray })

    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器'))
      this.setState({
        loading: false
      })
    }
  }

  async fetchCarModel() {
    try {
      let carModeData = await Session.Lookup.Get(`v1/lookup/vehicleModels?manufacturerName=${this.state.manufacturer}`)
      let dataArray = []
      carModeData.map(item => {
        dataArray.push(item.name)
      })
      this.setState({ carModelData: dataArray })
    } catch (e) {
      console.log(e)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.state.manufacturer)
    // console.log(nextState.manufacturer)

    if (nextState.manufacturer !== this.state.manufacturer){
      this.setState({carModel: ''})
    }

    return true
  }

  searchByRegExp(text, type){
    let data = []

    if (type === 'manufacturer') {
      data = this.state.manufacturerData
    }else if (type === 'carModel') {
      data = this.state.carModelData
    }

    if(!(data instanceof Array)){
      return
    }
    let len = data.length
    let arr = []

    let reg = new RegExp(text.toLowerCase())

    for(let i=0 ; i<len ; i++){
      let fullName = data[i]
      //如果字符串中不包含目标字符会返回-1
      if(fullName.toLowerCase().match(reg)){
        arr.push(data[i])
      }
    }

    return arr
  }

  manufacturerInputOnFocus = () => {
    this.isBottomView = true
    this.handleInputFocus(false, 'manufacturer')
  }

  manufacturerInputOnBlur = () => {
    this.isBottomView = false
    this.fetchCarModel()
    this.handleInputFocus(true, 'manufacturer')

  }

  carModelInputOnFocus = () => {
    this.handleInputFocus(false, 'carModel')
  }

  carModelInputOnBlur = () => {
    this.handleInputFocus(true, 'carModel')
  }

  handleInputFocus = (isFocus, type) => {
    if (type === 'manufacturer') {
      this.setState({isManufacturerFocus: isFocus})
    }else if (type === 'carModel') {
      this.setState({isCarModelFocus: isFocus})
    }
  }


   onSubmit = async () => {
     // console.log('carNumber', this.state.carNumber)
     // console.log('manufacturer', this.state.manufacturer)
     // console.log('carModel', this.state.carModel)
     // console.log('manufactureYear', this.state.manufactureYear)
     // console.log('color', this.state.color)

     const { carNumber, manufacturer, carModel, manufactureYear, color } = this.state

     if (carNumber && manufacturer && carModel && manufactureYear && color){
       this.props.dispatch(application.showHUD())
       try {
         let vehicleData = await Session.User.Put('v1/profile/vehicle',{
           registrationNo: carNumber,
           manufacturer: manufacturer,
           model: carModel,
           manufactureYear: manufactureYear,
           color: color
         })

         this.props.dispatch(account.setAccountValue({
           user: Object.assign({}, this.props.user, {vehicles: vehicleData.vehicles})
         }))

         this.props.dispatch(application.hideHUD())

         this.props.navigation.pop()

         // console.log(vehicleData)

       } catch (e) {
         console.log(e)
         this.props.dispatch(application.showMessage('网络错误，请稍后重试'))
       }
     } else {
       this.props.dispatch(application.showMessage('参数不能为空'))
     }
   }

  cancelPress = () => {
    this.props.navigation.pop()

    // this.props.dispatch(application.showHUD())
  }

  render() {
    const { manufacturer, isManufacturerFocus, carModel, isCarModelFocus } = this.state

    const { i18n } = this.props;

    const handleManufacturer = this.searchByRegExp(manufacturer, 'manufacturer')

    let handleCarModel = this.searchByRegExp(carModel, 'carModel')

    const androidStyle = System.Platform.Android ? {left: 20, position: 'absolute', top: height - 85-70 } : null

    return (
      <View style={[styles.container]}>
        <View
          style={[{backgroundColor: 'white', flex: 1},
            { paddingBottom: this.state.keyboardHeight, }
          ]}
        >
          <ScrollView keyboardShouldPersistTaps='always'
            style={{ backgroundColor:'white'}}
          >
            <InfoInput title={i18n.car_registration_number} placeholder={i18n.input_prompt}
              onChangeText={(text)=>{
                // console.log(text)
                this.setState({
                  carNumber: text,
                })
              }}
            />
            <AutoComplete autoCapitalize={'none'}
              hideResults={isManufacturerFocus}
              data={handleManufacturer}
              containerStyle={[styles.autocompleteContainer]}
              renderTextInput={()=>
                <InfoInput title={i18n.car_manufacturer} placeholder={i18n.input_prompt}
                  onChangeText={(text)=>{this.setState({manufacturer: text, isManufacturerFocus: false})}}
                  value={manufacturer}
                  onFocus={this.manufacturerInputOnFocus}
                  onBlur={this.manufacturerInputOnBlur}
                />}
              inputContainerStyle={styles.inputContainerStyle}
              listContainerStyle={styles.listContainerStyle}
              listStyle={styles.listStyle}
              renderSeparator={()=><View style={{width, backgroundColor:'#ddd',height:1}}/>}
              renderItem={item => (
                <TouchableOpacity onPress={() => {
                  // console.log(item)
                  this.setState({ manufacturer: item, isManufacturerFocus: true })
                }}
                style={styles.itemStyle}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <AutoComplete
              hideResults={isCarModelFocus}
              data={handleCarModel}
              containerStyle={[styles.autocompleteContainer, {top: 170,  zIndex: 999}]}
              renderTextInput={()=>
                <InfoInput title={i18n.car_modal} placeholder={i18n.input_prompt}
                  onChangeText={(text)=>{this.setState({carModel: text, isCarModelFocus: false})}}
                  value={carModel}
                  onFocus={this.carModelInputOnFocus}
                  onBlur={this.carModelInputOnBlur}
                />}
              inputContainerStyle={styles.inputContainerStyle}
              listContainerStyle={styles.listContainerStyle}
              listStyle={styles.listStyle}
              renderSeparator={()=><View style={{width, backgroundColor:'#ddd',height:1}}/>}
              renderItem={item => (
                <TouchableOpacity onPress={() => {
                  // console.log(item)
                  this.setState({ carModel: item, isCarModelFocus: true })
                }}
                style={styles.itemStyle}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{marginTop: 180}}>
              <InfoInput title={i18n.car_manufacture_year}  placeholder={i18n.input_prompt}
                onChangeText={(text)=>{
                  this.setState({
                    manufactureYear: text,
                  })
                }}
              />
              <InfoInput title={i18n.car_color} placeholder={i18n.input_prompt}
                onChangeText={(text)=>{
                  // console.log(text)
                  this.setState({
                    color: text,
                  })
                }}
              />
            </View>

          </ScrollView>
        </View>
        <View style={[{flexDirection: 'row', height: this.state.iosBottomViewHeight, left: 20, backgroundColor:'white'}, androidStyle]}>
          <TouchButton title={i18n.cancel} backgroundColor={'#cfcfcf'} onPress={this.cancelPress}/>
          <TouchButton title={i18n.sub} backgroundColor={'#5FD700'} style={{marginLeft: 10}} onPress={this.onSubmit}/>
        </View>
      </View>
    )}
})


function TouchButton(props) {
  const { style, title, backgroundColor, onPress } = props
  return(
    <TouchableOpacity style={[styles.touchButton,{backgroundColor}, style]} onPress={onPress}>
      <Text style={{fontSize: 18, color:'black', fontWeight: 'bold'}}>{title}</Text>
    </TouchableOpacity>
  )
}

class AutoInfoInput extends Component{

  constructor(props){
    super(props)
    this.state = {
      isFocus: false,
      data: this.props.data,
      handleData: this.props.handleData,
      inputValue: this.props.inputValue,
      // inputChangeText: this.props
    }
  }
  render() {
    const { data, isFocus, inputValue } = this.state
    const { inputChangeText, handleData } = this.props
    // console.log(this.props.handleData)
    return(
      <AutoComplete autoCapitalize={'none'}
        // hideResults={isFocus}
        data={handleData}
        renderTextInput={()=>
          <InfoInput title={'Manufacturer'} placeholder={'Please enter here'}
            onChangeText={(text)=>{this.setState({manufacturer: text, isManufacturerFocus: false})}}
            value={inputValue}
            // onFocus={this.manufacturerInputOnFocus}
            // onBlur={this.manufacturerInputOnBlur}
          />}
        inputContainerStyle={styles.inputContainerStyle}
        listContainerStyle={styles.listContainerStyle}
        listStyle={styles.listStyle}
        renderSeparator={()=><View style={{width, backgroundColor:'#ddd',height:1}}/>}
        renderItem={item => (
          <TouchableOpacity onPress={() => {
            console.log(item)
            this.setState({ manufacturer: item, isManufacturerFocus: true })
          }}
          style={styles.itemStyle}>
            <Text>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    )
  }
}

function InfoInput(props) {
  const { style, placeholder, title } = props
  return(
    <View style={[{paddingHorizontal: 20}, style]}>
      <Text style={{fontSize: 16, color: '#000', opacity: 0.8, paddingTop: 10,}}>{title}</Text>
      <Input {...Define.TextInputArgs} clearTextOnFocus={false} placeholder={placeholder} style={{height: 44, paddingLeft: 4, fontSize: 15, }} {...props}/>
      <View style={{height: 1, backgroundColor:'#ddd',}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // height
  },
  inputContainerStyle:{
    borderColor:'white',
    // backgroundColor: 'red'
    // marginHorizontal: 18,
    // backgroundColor: 'red',
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 85,
    zIndex: 10000
  },
  listContainerStyle:{
    marginHorizontal: System.Platform.iOS ? 20 : 10,
    // backgroundColor:'blue',
    width: width - 40,
  },
  listStyle:{
    // borderColor: 'transparent',
    borderWidth: 0,
    // backgroundColor: 'red'
  },
  itemStyle:{
    // backgroundColor:'blue',
    // paddingHorizontal: 20,
    height: 40,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  touchButton:{
    width: width / 2 - 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#cfcfcf',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.21)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1
  }
})