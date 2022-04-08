import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLNonNull,
  GraphQLOutputType
} from 'graphql'
import { FieldError, fieldsRegistry } from '../Field'

import { compileFieldResolver } from './resolver'
import {
  isRootFieldOnNonRootBase,
  resolveRegisteredOrInferredType,
  validateResolvedType
} from './services'

import { validateNotInferableField } from './fieldType'
import { compileFieldArgs } from '../../arg/ArgDecorators'
import { Constructor } from 'typescript-rtti'
import { interfaceTypeRegistry } from '../../../../src/domains/interfaceType/interfaceTypeRegistry'

export function compileFieldConfig(
  target: Constructor<Function>,
  fieldName: string
): GraphQLFieldConfig<any, any, any> {
  const fieldRegistryConfig = fieldsRegistry.get(target, fieldName)

  const {
    description,
    type,

    onlyDecoratedArgs,
    deprecationReason
  } = fieldRegistryConfig
  const args = compileFieldArgs(target as any, fieldName, !!onlyDecoratedArgs)

  const resolvedType = resolveRegisteredOrInferredType(
    target,
    fieldName,
    type
  ) as GraphQLOutputType

  // if was not able to resolve type, try to show some helpful information about it
  if (!resolvedType && !validateNotInferableField(target, fieldName)) {
    throw new Error('could not resolve type')
  }

  // show error about being not able to resolve field type
  if (!validateResolvedType(target, fieldName, resolvedType)) {
    validateNotInferableField(target, fieldName)
  }

  let castTo = type || resolvedType

  if (
    interfaceTypeRegistry.has(castTo) ||
    (Array.isArray(castTo) && interfaceTypeRegistry.has(castTo[0]))
  ) {
    castTo = null
  }
  return {
    description,
    type: resolvedType,
    deprecationReason,
    resolve: compileFieldResolver(target, fieldName, castTo),
    // @ts-expect-error
    args
  }
}

function getAllFields(target: Constructor<Function>) {
  const fields = fieldsRegistry.getAll(target)

  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {}
  Object.keys(fields).forEach((fieldName) => {
    if (isRootFieldOnNonRootBase(target, fieldName)) {
      throw new FieldError(
        target,
        fieldName,
        `Given field is root field (@Query or @Mutation) not registered inside @SchemaRoot type. `
      )
    }

    const config = fieldsRegistry.get(target, fieldName)

    finalFieldsMap[config.name] = compileFieldConfig(target, fieldName)
  })
  return finalFieldsMap
}

export function compileAllFields(
  targetWithParents: Array<Constructor<Function>>
) {
  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {}

  targetWithParents.forEach((targetLevel) => {
    targetLevel && Object.assign(finalFieldsMap, getAllFields(targetLevel))
  })

  return finalFieldsMap
}
