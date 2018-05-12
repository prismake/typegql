import { GraphQLType } from 'graphql';
import { inferTypeByTarget, resolveType } from '~/services/utils';
import { FieldError } from '../index';

export function resolveTypeOrThrow(
  type: any,
  target: Function,
  fieldName: string,
): GraphQLType {
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

export function inferTypeOrThrow(target: Function, fieldName: string): GraphQLType {
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

export function validateNotInferableField(target: Function, fieldName: string) {
  const inferedType = inferTypeByTarget(target.prototype, fieldName);
  if (inferedType === Array) {
    throw new FieldError(
      target,
      fieldName,
      `Field returns list so it's required to explicitly set list item type. You can set list type like: @Field({ type: [ItemType] })`,
    );
  }

  if (inferedType === Promise) {
    throw new FieldError(
      target,
      fieldName,
      `Field returns Promise so it's required to explicitly set resolved type as it's not possible to guess it. You can set resolved type like: @Field({ type: ItemType })`,
    );
  }
  return true;
}
