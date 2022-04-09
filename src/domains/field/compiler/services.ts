import {
  isOutputType,
  GraphQLType,
  GraphQLOutputType,
  GraphQLNonNull
} from 'graphql'
import { FieldError } from '../Field'

import { resolveTypeOrThrow, throwIfNotInferableType } from './fieldType'
import {
  mutationFieldsRegistry,
  isSchemaRoot,
  queryFieldsRegistry
} from '../../schema/SchemaRoot'
import {
  IResolveTypeParams,
  resolveType
} from '../../../services/utils/gql/types/typeResolvers'
import { inferTypeByTarget } from '../../../services/utils/gql/types/inferTypeByTarget'

export function resolveRegisteredOrInferredType(
  target: Function,
  fieldName: string,
  fieldResolveConfig: IResolveTypeParams
) {
  const inferredType = inferTypeByTarget(target.prototype, fieldName)

  throwIfNotInferableType(inferredType, target, fieldName)

  if (fieldResolveConfig && fieldResolveConfig.runtimeType) {
    return resolveTypeOrThrow(fieldResolveConfig, target, fieldName)
  } else if (!inferredType) {
    throw new FieldError(
      target,
      fieldName,
      `Could not infer return type and no type is explicitly configured. In case of circular dependencies make sure to explicitly set a type.`
    )
  }
  return resolveType(inferredType)
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
