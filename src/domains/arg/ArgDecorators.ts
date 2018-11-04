import { argRegistry } from './registry'
export { compileFieldArgs } from './compiler'
import { ArgOptions, defaultArgOptions } from './options'

export function Arg(options: ArgOptions = {}): ParameterDecorator {
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
export function ArgNullable(options: ArgOptions = {}): ParameterDecorator {
  return Arg({ ...options, isNullable: true })
}
