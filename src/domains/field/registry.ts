import { rootFieldTypes } from '../schema/rootFields'
import { DeepWeakMap } from '../../services/utils/deepWeakMap/DeepWeakMap'

export interface IAllRegisteredFields {
  [fieldName: string]: IFieldInnerConfig
}

export const fieldsRegistry = new DeepWeakMap<
  Function,
  IFieldInnerConfig,
  IAllRegisteredFields
>()

export interface IFieldInnerConfig {
  name: string
  rootFieldType?: rootFieldTypes
  property: string
  description?: string
  isNullable?: boolean
  castTo?: any
  type?: any
}

export interface IAllQueryFields {
  [fieldName: string]: IFieldInnerConfig
}

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  IFieldInnerConfig,
  IAllQueryFields
>()
