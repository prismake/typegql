import { DeepWeakMap } from '../../services/utils/deepWeakMap/DeepWeakMap'

export interface IArgInnerConfig {
  description?: string
  isNullable?: boolean
  type?: any
  inferredType?: any
  name?: string
  argIndex: number
}
export const argRegistry = new DeepWeakMap<
  Function,
  IArgInnerConfig,
  {
    [fieldName: string]: IArgsIndex
  }
>()

export interface IArgsIndex {
  [argIndex: number]: IArgInnerConfig
  length: number
}
