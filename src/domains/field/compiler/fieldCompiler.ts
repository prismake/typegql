import { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql'
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
  const { type, description, isNullable, castTo } = fieldsRegistry.get(
    target,
    fieldName
  )
  const args = compileFieldArgs(target, fieldName)
  const forcedType = castTo ? castTo : type

  const resolvedType = resolveRegisteredOrInferedType(
    target,
    fieldName,
    forcedType
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
  const finalType = enhanceType(resolvedType, isNullable)

  return {
    description,
    type: finalType,
    resolve: compileFieldResolver(target, fieldName, castTo),
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
        `Given field is root field (@Query or @Mutation) not registered inside @Schema type. `
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
