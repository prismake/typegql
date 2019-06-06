import { BaseError } from '../../services/error'
import { getParameterNames } from '../../services/utils/getParameterNames'
import { ICompileArgContextType } from './compiler'

export class ArgError extends BaseError {
  constructor(ctx: ICompileArgContextType, argIndex: number, msg: string) {
    const { target, fieldName } = ctx
    const paramNames = getParameterNames(target.prototype[fieldName])
    const paramName = paramNames[argIndex]
    const fullMsg = `@Type ${
      target.name
    }.${fieldName}(${paramName} <-------): ${msg}`
    super(fullMsg)
    this.message = fullMsg
  }
}
