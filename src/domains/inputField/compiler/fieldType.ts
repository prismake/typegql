import { GraphQLType } from 'graphql';
import { inferTypeByTarget } from '~/services/utils';
import { InputFieldError } from '../index';

import { resolveType } from '~/services/utils';

export function resolveTypeOrThrow(
  type: any,
  target: Function,
  fieldName: string,
): GraphQLType {
  const resolvedType = resolveType(type);

  if (!resolvedType) {
    throw new InputFieldError(
      target,
      fieldName,
      `Forced type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator`,
    );
  }

  return resolvedType;
}

export function inferTypeOrThrow(target: Function, fieldName: string): GraphQLType {
  const inferedType = inferTypeByTarget(target.prototype, fieldName);
  if (!inferedType) {
    throw new InputFieldError(
      target,
      fieldName,
      `Could not infer return type and no type is forced. In case of circular dependencies make sure to force types of instead of infering them.`,
    );
  }
  return resolveType(inferedType);
}
