import { GraphQLInputObjectType, GraphQLInputFieldConfigMap } from 'graphql'
import {
  InputObjectTypeError,
  inputObjectTypeRegistry
} from './InputObjectType'

import {
  inputFieldsRegistry,
  compileAllInputFields
} from '../inputField/InputFieldDecorators'
import { createCachedThunk } from '../../services/utils/cachedThunk'
import { getClassWithAllParentClasses } from '../../services/utils/inheritance'

const compileOutputTypeCache = new WeakMap<Function, GraphQLInputObjectType>()

export interface ITypeOptions {
  name: string
  description?: string
}

function createTypeInputFieldsGetter(
  target: Function
): () => GraphQLInputFieldConfigMap {
  const targetWithParents = getClassWithAllParentClasses(target)
  const hasFields = targetWithParents.some((ancestor) => {
    return !inputFieldsRegistry.isEmpty(ancestor)
  })

  if (!hasFields) {
    throw new InputObjectTypeError(
      target,
      `There are no fields inside this type.`
    )
  }

  return createCachedThunk(() => {
    return compileAllInputFields(target)
  })
}

export function compileInputObjectTypeWithConfig(
  target: Function,
  config: ITypeOptions
): GraphQLInputObjectType {
  const outputTypeCache = compileOutputTypeCache.get(target)

  if (outputTypeCache) {
    return outputTypeCache
  }
  const compiled = new GraphQLInputObjectType({
    ...config,
    fields: createTypeInputFieldsGetter(target)
  })

  compileOutputTypeCache.set(target, compiled)
  return compiled
}

export function compileInputObjectType(target: Function) {
  const compiler = inputObjectTypeRegistry.get(target)

  if (!compiler) {
    throw new InputObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @InputObjectType decorator`
    )
  }

  return compiler()
}
