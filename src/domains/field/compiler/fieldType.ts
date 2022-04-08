import { GraphQLType } from 'graphql'

import { FieldError } from '../Field'
import { resolveType } from '../../../services/utils/gql/types/typeResolvers'
import { inferTypeByTarget } from '../../../services/utils/gql/types/inferTypeByTarget'

export function resolveTypeOrThrow(
  type: any,
  target: Function,
  fieldName: string
): GraphQLType {
  const resolvedType = resolveType({ runtimeType: type })

  if (!resolvedType) {
    throw new FieldError(
      target,
      fieldName,
      `Explicit type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator`
    )
  }

  return resolvedType
}

function throwIfNotInferableType(
  inferredType: any,
  target: Function,
  fieldName: string
) {
  if (typeof inferredType === 'function') {
    const stringSignature = inferredType.toString()
    // console.log('~ stringSignature', stringSignature)
    if (
      stringSignature.match(
        // previously we've been comparing tho these functions directly, but this would fail in environments where for example Promise was monkeypatched
        /function (Object|Array|Promise)\(\) { \[native code\] }/
      )
    ) {
      throw new FieldError(
        target,
        fieldName,
        `Field type was inferred as "${inferredType}" so it's required to explicitly set the type as it's not possible to guess it. Pass it in a config for the field like: @Field({ type: ItemType })`
      )
    }
  }
}

export function inferTypeOrThrow(
  target: Function,
  fieldName: string
): GraphQLType {
  const inferredType = inferTypeByTarget(target.prototype, fieldName)

  if (!inferredType) {
    throw new FieldError(
      target,
      fieldName,
      `Could not infer return type and no type is explicitly configured. In case of circular dependencies make sure to explicitly set a type.`
    )
  }
  throwIfNotInferableType(inferredType, target, fieldName)
  return resolveType(inferredType)
}

export function validateNotInferableField(target: Function, fieldName: string) {
  const inferredType = inferTypeByTarget(target.prototype, fieldName)
  throwIfNotInferableType(inferredType, target, fieldName)
  return true
}
