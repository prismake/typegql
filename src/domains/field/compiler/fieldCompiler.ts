import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'
import { FieldError, fieldsRegistry } from '../Field'

import { compileFieldResolver } from './resolver'
import {
  enhanceType,
  isRootFieldOnNonRootBase,
  resolveRegisteredOrInferedType,
  validateResolvedType
} from './services'

import { validateNotInferableField } from './fieldType'
import { compileFieldArgs } from '../../arg/ArgDecorators'

export function compileFieldConfig(
  target: Function,
  fieldName: string
): GraphQLFieldConfig<any, any, any> {
  const fieldRegistryConfig = fieldsRegistry.get(target, fieldName)
  const {
    type,
    description,
    isNullable,
    itemNullable,
    castTo,
    itemCast,
    onlyDecoratedArgs,
    deprecationReason
  } = fieldRegistryConfig
  const args = compileFieldArgs(target, fieldName, onlyDecoratedArgs)
  const arrayFieldType =
    fieldRegistryConfig.itemType || fieldRegistryConfig.itemCast

  const explicitType = arrayFieldType ? arrayFieldType : castTo ? castTo : type

  const resolvedType = resolveRegisteredOrInferedType(
    target,
    fieldName,
    explicitType
  )

  // if was not able to resolve type, try to show some helpful information about it
  if (!resolvedType && !validateNotInferableField(target, fieldName)) {
    return
  }

  // show error about being not able to resolve field type
  if (!validateResolvedType(target, fieldName, resolvedType)) {
    validateNotInferableField(target, fieldName)
    return
  }

  const finalType = arrayFieldType
    ? new GraphQLNonNull(
        new GraphQLList(enhanceType(resolvedType, itemNullable))
      )
    : enhanceType(resolvedType, isNullable)
  return {
    description,
    type: finalType,
    deprecationReason,
    resolve: compileFieldResolver(target, fieldName, castTo || itemCast),
    args
  }
}

function getAllFields(target: Function) {
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

export function compileAllFields(targetWithParents: Function[]) {
  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {}

  targetWithParents.forEach((targetLevel) => {
    Object.assign(finalFieldsMap, getAllFields(targetLevel))
  })

  return finalFieldsMap
}
