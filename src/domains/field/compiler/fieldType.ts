import { inferTypeByTarget } from 'services/utils';
import { getRegisteredField, FieldError } from '../index';

import { resolveType } from 'services/utils';

export function compileFieldType(target: Function, fieldName: string) {
  const { type } = getRegisteredField(target, fieldName);

  if (type) {
    const resolvedType = resolveType(type);

    if (!resolvedType) {
      throw new FieldError(
        target,
        fieldName,
        `Forced type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator`,
      );
    }

    return resolvedType;
  }

  const inferedType = inferTypeByTarget(target.prototype, fieldName);
  if (!inferedType) {
    throw new FieldError(
      target,
      fieldName,
      `Could not infer return type and no type is forced. In case of circular dependencies make sure to force types of instead of infering them.`,
    );
  }
  return resolveType(inferedType);
}
