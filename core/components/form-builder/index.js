// @flow
import React, { Component, PureComponent } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import FormContainer from './form.container'
import FormGroup from './form.group'
import { FormEditorScreen, EditorBuilder } from './form.editor'

import FieldsFileUpload from './fields.file.upload'
import FieldsSelect from './fields.select'
import { CreateFieldsTextInput, FieldsTextInput } from './fields.text.input'
import FieldsSwitch from './fields.switch'


interface FormComponentInterface {

  generate() : void

}

class FormComponentBase {
  
  constructor() {

  }

}

// class GroupBuilder {
  
//   constructor(title, fields, index) {
//     this.title = title
//     this.items = fields
//     this.key = index
//   }

//   add() {

//   }

//   join() {

//   }

//   delete() {

//   }

//   jsx() {
//     const { items = [], title = '', key } = this
//     return (
//       <FormGroup key={key} title={title}>
//         { items }
//       </FormGroup>
//     )
//   }

// }

class FormBuilder extends FormComponentBase<FormComponentInterface> {
  
  constructor(props) {
    super(props)
    this.builder = []
    this.filter = () => ({})
  }

  addGroup(group: GroupBuilder) : CreateForm {
    this.builder.push(group)
    return this
  }

  add(title, fields) : CreateForm {
    const group = { title, fields, key: this.builder.length }
    this.builder.push(group)
    return this
  }

  jsx(props) {
    const { builder } = this
    return (
      <FormContainer>
        {
          builder.map((pipe, index) => {
            const fields = !Array.isArray(pipe.fields) ? 
              React.cloneElement(pipe.fields, { index: 0 }) : 
              pipe.fields.map((sub, index) => React.cloneElement(sub, { index, ...props }))

            return (
              <FormGroup title={pipe.title} id={index} key={index}>
                {fields}
              </FormGroup>
            )
          })
        }
      </FormContainer>
    )
  }

  component(title = '', navigationOptions = {}) {
    const { builder } = this
    return class _ extends PureComponent {

      static navigationOptions = () => {
        return Object.assign({}, {
          drawerLockMode: 'locked-closed', 
          title
        }, navigationOptions)
      }

      render() {
        const { props } = this

        console.log(props)

        return (
          <FormContainer>
            {
              builder.map((pipe, index) => {
                const fields = !Array.isArray(pipe.fields) ? 
                  React.cloneElement(pipe.fields, { index: 0 }) : 
                  pipe.fields.map((sub, index) => React.cloneElement(sub, { index, ...props }))

                return (
                  <FormGroup title={pipe.title} id={index} key={index}>
                    {fields}
                  </FormGroup>
                )
              })
            }
          </FormContainer>
        )
      }

    }
  }

}

const Fileds = {
  TextInput: CreateFieldsTextInput,
  FileUpload: () => {

  },
  Select: () => {

  },
  Switch: () => {

  }
}

export {
  FormContainer,
  FormGroup,

  FormEditorScreen,
  EditorBuilder,
  
  FieldsFileUpload,
  FieldsSelect,
  FieldsTextInput,
  FieldsSwitch,


  Fileds,
  FormBuilder
}