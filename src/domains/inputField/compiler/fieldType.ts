import { GraphQLType } from 'graphql'

import { InputFieldError } from '../InputFieldDecorators'
import { resolveType } from '../../../services/utils/gql/types/typeResolvers'
import { inferTypeByTarget } from '../../../services/utils/gql/types/parseNative'

export function resolveTypeOrThrow(
  type: any,
  target: Function,
  fieldName: string
): GraphQLType {
  const resolvedType = resolveType(type, true, true)

  if (!resolvedType) {
    throw new InputFieldError(
      target,
      fieldName,
      `Explicit type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator`
    )
  }

  return resolvedType
}

export function inferTypeOrThrow(
  target: Function,
  fieldName: string
): GraphQLType {
  const inferredType = inferTypeByTarget(target.prototype, fieldName)

  if (!inferredType) {
    throw new InputFieldError(
      target,
      fieldName,
      `Could not infer return type and no type is explicitly configured. In case of circular dependencies make sure to force types of instead of infering them.`
    )
  }

  return resolveType(inferredType, true, true)
}
