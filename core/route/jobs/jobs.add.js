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
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
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
    // this.keyboardDidShowListener.remove()
    // this.keyboardDidHideListener.remove()
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

  async fetchCarModel(text) {
    this.setState({manufacturer: text})
    try {
      let carModelData = await Session.Lookup.Get(`v1/lookup/vehicleModels?manufacturerName=${this.state.manufacturer}`)
      carModelData = await Session.Lookup.Get(`v1/lookup/vehicleModels?manufacturerName=${text}`)

      let dataArray = []
      carModelData.map(item => {
        dataArray.push(item.name)
      })
      // console.log(carModelData)
      this.setState({ carModelData: dataArray })
    } catch (e) {
      console.log(e)
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
        this.props.dispatch(application.hideHUD())
        this.props.dispatch(application.showMessage(this.props.i18n.error_try_again))
      }
    } else {
      this.props.dispatch(application.showMessage(this.props.i18n.error_params_empty))
    }
  }

  cancelPress = () => {
    this.props.navigation.pop()

    // this.props.dispatch(application.showHUD())
  }

  render() {
    const { manufacturer, isManufacturerFocus, carModel, isCarModelFocus } = this.state

    const { i18n } = this.props

    // const handleManufacturer = this.searchByRegExp(manufacturer, 'manufacturer')

    // let handleCarModel = this.searchByRegExp(carModel, 'carModel')

    const { manufacturerData, carModelData } = this.state

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


            <AutoInfoInput
              data={manufacturerData}
              title={i18n.car_manufacturer}
              placeholder={i18n.input_prompt}
              type={'manufacturer'}
              inputChangeText={(text)=>{
                this.fetchCarModel(text)
              }}
            />


            <AutoInfoInput
              placeholder={i18n.input_prompt}
              title={i18n.car_model}
              data={carModelData}
              type={'model'}
              style={{top: 160,  zIndex: 999}}
              inputChangeText={(text)=>{
                // console.log(text)
                this.setState({carModel: text})
              }}
            />

            <View style={{marginTop: 170}}>
              <InfoInput title={i18n.car_manufacture_year}  placeholder={i18n.input_prompt}
                onChangeText={(text)=>{
                  this.setState({
                    manufactureYear: text,
                  })
                }}
              />
              <InfoInput title={i18n.car_color} placeholder={i18n.input_prompt}
                onChangeText={(text)=>{
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



class AutoInfoInput extends Component{

  constructor(props){
    super(props)
    this.state = {
      isFocusHide: true,
      data: this.props.data,
      type: this.props.type
    }
  }

  componentDidMount() {
    // console.log('type', this.props.type)
    // console.log('data', this.props.data)
  }

  handleText(s) {
    let pattern = new RegExp('[`~!#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
    let rs = ''
    for (let i = 0; i < s.length; i++) {
      rs = rs+s.substr(i, 1).replace(pattern, '')
    }
    return rs
  }

  carInfoChangeText = (text) => {

    let handleText = this.handleText(text)

    let data = this.props.data

    if(!(data instanceof Array)){
      return
    }
    let len = data.length
    let arr = []
    for(let i = 0 ; i < len ; i++){
      let title = data[i]

      if(title.toLowerCase().indexOf(handleText) >= 0){
        arr.push(data[i])
      }
    }

    this.setState({
      data: arr
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type === 'manufacturer') {
      // console.log(nextProps)
      this.setState({
        data: nextProps.data
      })
    }
    if (nextProps.type === 'model') {
      // console.log(nextProps)
      this.setState({
        data: nextProps.data
      })
    }
  }

  onFocus = () => {
    this.inputWithHidden(false)
  }

  onBlur = () => {
    this.inputWithHidden(true)
    this.props.onBlur && this.props.onBlur()
  }

  inputWithHidden = (focus: boolean) => {
    this.setState({isFocusHide: focus})
  }

  render() {

    const { data, isFocusHide, inputValue,  } = this.state
    const { inputChangeText, style, placeholder, title } = this.props

    return(
      <AutoComplete autoCapitalize={'none'}
        hideResults={isFocusHide}
        data={data}
        containerStyle={[styles.autocompleteContainer, style]}
        renderTextInput={()=>
          <InfoInput title={title} placeholder={placeholder}
            value={inputValue}
            onChangeText={(text)=>{
              this.carInfoChangeText(text)
              this.setState({inputValue: text, isFocusHide: false})
              inputChangeText(text)
            }}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />}
        inputContainerStyle={styles.inputContainerStyle}
        listContainerStyle={styles.listContainerStyle}
        listStyle={styles.listStyle}
        renderSeparator={()=><View style={{width, backgroundColor:'#ddd', height:1}}/>}
        renderItem={item => (
          <TouchableOpacity onPress={() => {
            this.setState({inputValue: item, isFocusHide: true})
            inputChangeText(item)
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

function TouchButton(props) {
  const { style, title, backgroundColor, onPress } = props
  return(
    <TouchableOpacity style={[styles.touchButton,{backgroundColor}, style]} onPress={onPress}>
      <Text style={{fontSize: 18, color:'black', fontWeight: 'bold'}}>{title}</Text>
    </TouchableOpacity>
  )
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
    top: 80,
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