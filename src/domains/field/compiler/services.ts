import {
  isOutputType,
  GraphQLType,
  GraphQLOutputType,
  GraphQLNonNull
} from 'graphql'
import { FieldError } from '../Field'

import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType'
import {
  mutationFieldsRegistry,
  isSchemaRoot,
  queryFieldsRegistry
} from '../../schema/SchemaRoot'
import { IResolveTypeParams } from '../../../services/utils/gql/types/typeResolvers'

export function resolveRegisteredOrInferredType(
  target: Function,
  fieldName: string,
  fieldConfig: IResolveTypeParams
) {
  if (fieldConfig && fieldConfig.runtimeType) {
    return resolveTypeOrThrow(fieldConfig, target, fieldName)
  }
  return inferTypeOrThrow(target, fieldName)
}

export function validateResolvedType(
  target: Function,
  fieldName: string,
  type: GraphQLType
): type is GraphQLOutputType {
  if (!isOutputType(type)) {
    throw new FieldError(
      target,
      fieldName,
      `Validation of type failed. Resolved type must be a GraphQLOutputType.`
    )
  }
  return true
}

export function enhanceType(
  originalType: GraphQLOutputType,
  isNullable: boolean
) {
  let finalType = originalType

  if (!isNullable) {
    finalType = new GraphQLNonNull(finalType)
  }
  return finalType
}

export function isRootFieldOnNonRootBase(base: Function, fieldName: string) {
  const isRoot = isSchemaRoot(base)

  if (isRoot) {
    return false
  }
  if (mutationFieldsRegistry.has(base, fieldName)) {
    return true
  }
  if (queryFieldsRegistry.has(base, fieldName)) {
    return true
  }
  return false
}
