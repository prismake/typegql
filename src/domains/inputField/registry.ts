import { DeepWeakMap } from '../../services/utils/deepWeakMap/DeepWeakMap'

export interface IAllRegisteredInputFields {
  [fieldName: string]: IFieldInputInnerConfig
}

export const inputFieldsRegistry = new DeepWeakMap<
  Function,
  IFieldInputInnerConfig,
  IAllRegisteredInputFields
>()

export interface IFieldInputInnerConfig {
  name: string
  defaultValue?: any
  property: string
  description?: string
  type?: any
  isNullable?: boolean
}
