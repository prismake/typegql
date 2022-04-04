import {
  isInputType,
  GraphQLInputType,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLNonNull
} from 'graphql'

import { InputFieldError, inputFieldsRegistry } from '../InputFieldDecorators'

import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType'
import { getClassWithAllParentClasses } from '../../../services/utils/inheritance'

function getFinalInputFieldType(
  target: Function,
  fieldName: string,
  explicitType?: any
) {
  if (explicitType) {
    return resolveTypeOrThrow(explicitType, target, fieldName)
  }
  return inferTypeOrThrow(target, fieldName)
}

export function compileInputFieldConfig(
  target: Function,
  fieldName: string
): GraphQLInputFieldConfig {
  const { type, description, defaultValue } = inputFieldsRegistry.get(
    target,
    fieldName
  )

  const resolvedType = getFinalInputFieldType(target, fieldName, type)

  if (!isInputType(resolvedType)) {
    throw new InputFieldError(
      target,
      fieldName,
      `Validation of type failed. Resolved type must be a GraphQLInputType.`
    )
  }

  return {
    description,
    defaultValue,
    type: resolvedType
  }
}

export function compileAllInputFieldsForSingleTarget(target: Function) {
  const fields = inputFieldsRegistry.getAll(target)
  const finalFieldsMap: GraphQLInputFieldConfigMap = {}
  Object.keys(fields).forEach((fieldName) => {
    const config = inputFieldsRegistry.get(target, fieldName)
    finalFieldsMap[config.name] = compileInputFieldConfig(target, fieldName)
  })
  return finalFieldsMap
}

export function compileAllInputFields(target: Function) {
  const targetWithParents = getClassWithAllParentClasses(target)
  const finalFieldsMap: GraphQLInputFieldConfigMap = {}

  targetWithParents.forEach((targetLevel) => {
    Object.assign(
      finalFieldsMap,
      compileAllInputFieldsForSingleTarget(targetLevel)
    )
  })
  return finalFieldsMap
}
