import { compileObjectTypeWithConfig } from './compiler/objectType'
import { objectTypeRegistry } from './registry'
import { interfaceTypeImplementors } from '../interfaceType/interfaceTypeRegistry'
import { Thunk } from 'graphql'

export { compileObjectType } from './compiler/objectType'
export { ObjectTypeError } from './error'
export { objectTypeRegistry, inputTypeRegistry } from './registry'

export interface IObjectTypeOptions {
  name?: string
  description?: string
  mixins?: Function[] | Thunk<any>
  implements?: Function
}

export function ObjectType(options?: IObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    if (options && options.implements) {
      const implementors = interfaceTypeImplementors.get(options.implements)
      if (!implementors) {
        interfaceTypeImplementors.set(options.implements, [target])
      } else {
        implementors.push(target)
      }
    }

    const config = { name: target.name, ...options }
    const outputTypeCompiler = () => compileObjectTypeWithConfig(target, config)

    objectTypeRegistry.set(target, outputTypeCompiler)
  }
}
