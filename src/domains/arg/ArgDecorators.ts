import { argRegistry } from './registry'
export { compileFieldArgs } from './compiler'
import { IArgOptions, defaultArgOptions } from './options'

export function Arg(options: IArgOptions = {}): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    argRegistry.set(target.constructor, [fieldName, argIndex], {
      ...defaultArgOptions,
      ...options,
      argIndex
    })
  }
}

/**
 * a shorthand for @Arg({isNullable: true})
 */
export function ArgNullable(options: IArgOptions = {}): ParameterDecorator {
  return Arg({ ...options, isNullable: true })
}
