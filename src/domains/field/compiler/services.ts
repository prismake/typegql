import { isOutputType, GraphQLType, GraphQLOutputType, GraphQLNonNull } from 'graphql';
import { FieldError } from '../index';

import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType';
import {
  schemaRootsRegistry,
  mutationFieldsRegistry,
  queryFieldsRegistry,
} from '~/domains/schema';

export function resolveRegisteredOrInferedType(
  target: Function,
  fieldName: string,
  forcedType?: any,
) {
  if (forcedType) {
    return resolveTypeOrThrow(forcedType, target, fieldName);
  }
  return inferTypeOrThrow(target, fieldName);
}

export function validateResolvedType(
  target: Function,
  fieldName: string,
  type: GraphQLType,
): type is GraphQLOutputType {
  if (!isOutputType(type)) {
    throw new FieldError(
      target,
      fieldName,
      `Validation of type failed. Resolved type for @Field must be GraphQLOutputType.`,
    );
  }
  return true;
}

export function enhanceType(originalType: GraphQLOutputType, isNullable: boolean) {
  let finalType = originalType;
  if (!isNullable) {
    finalType = new GraphQLNonNull(finalType);
  }
  return finalType;
}

export function isRootFieldOnNonRootBase(base: Function, fieldName: string) {
  const isRoot = schemaRootsRegistry.has(base);
  if (isRoot) {
    return false;
  }
  if (mutationFieldsRegistry.has(base, fieldName)) {
    return true;
  }
  if (queryFieldsRegistry.has(base, fieldName)) {
    return true;
  }
  return false;
}
