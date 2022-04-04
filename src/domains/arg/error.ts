import { reflect } from 'typescript-rtti'
import { BaseError } from '../../services/error'

import { ICompileArgContextType } from './compiler'

export class ArgError extends BaseError {
  constructor(ctx: ICompileArgContextType, argIndex: number, msg: string) {
    const { target, fieldName } = ctx
    const paramNames = reflect(target).getOwnMethod(fieldName).parameterNames
    const paramName = paramNames[argIndex]
    const fullMsg = `@Type ${target.name}.${fieldName}(${paramName} <-------): ${msg}`
    super(fullMsg)
    this.message = fullMsg
  }
}
