import { DeepWeakMap } from '../../services/utils'
import { rootFieldTypes } from '../schema/rootFields'

export interface AllRegisteredFields {
  [fieldName: string]: FieldInnerConfig
}

export const fieldsRegistry = new DeepWeakMap<
  Function,
  FieldInnerConfig,
  AllRegisteredFields
>()

export interface FieldInnerConfig {
  name: string
  rootFieldType?: rootFieldTypes
  property: string
  description?: string
  isNullable?: boolean
  type?: any
}

export interface AllQueryFields {
  [fieldName: string]: FieldInnerConfig
}

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  FieldInnerConfig,
  AllQueryFields
>()
