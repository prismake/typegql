import { compileObjectTypeWithConfig } from './compiler/objectType'
import { objectTypeRegistry } from './registry'
import { interfaceTypeImplementors } from '../interfaceType/interfaceTypeRegistry'
import { ThunkReadonlyArray } from 'graphql'

export { compileObjectType } from './compiler/objectType'
export { ObjectTypeError } from './error'
export { objectTypeRegistry, inputTypeRegistry } from './registry'

export interface IObjectTypeOptions {
  name?: string
  description?: string
  mixins?: ThunkReadonlyArray<any>
  implements?: Function[]
}

export function ObjectType(options?: IObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    if (options && options.implements) {
      options.implements.forEach((interfaceClass) => {
        const implementors = interfaceTypeImplementors.get(interfaceClass)
        if (!implementors) {
          interfaceTypeImplementors.set(interfaceClass, [target])
        } else {
          implementors.push(target)
        }
      })
    }

    const config = { name: target.name, ...options }
    const outputTypeCompiler = () => compileObjectTypeWithConfig(target, config)

    objectTypeRegistry.set(target, outputTypeCompiler)
  }
}
