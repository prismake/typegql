import { GraphQLObjectType } from 'graphql';
import { ObjectTypeError, objectTypeRegistry } from '../index';

import { compileAllFields, fieldsRegistry } from '~/domains/field';
import { createCachedThunk, getClassWithAllParentClasses } from '~/services/utils';

const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>();

export interface TypeOptions {
  name: string;
  description?: string;
}

function createTypeFieldsGetter(target: Function) {
  const targetWithParents = getClassWithAllParentClasses(target);
  const hasFields = targetWithParents.some(ancestor => {
    return !fieldsRegistry.isEmpty(ancestor);
  });

  if (!hasFields) {
    throw new ObjectTypeError(target, `There are no fields inside this type.`);
  }

  return createCachedThunk(() => {
    return compileAllFields(target);
  });
}

export function compileObjectTypeWithConfig(
  target: Function,
  config: TypeOptions,
): GraphQLObjectType {
  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target);
  }

  const compiled = new GraphQLObjectType({
    ...config,
    isTypeOf: value => value instanceof target,
    fields: createTypeFieldsGetter(target),
  });

  compileOutputTypeCache.set(target, compiled);
  return compiled;
}

export function compileObjectType(target: Function) {
  if (!objectTypeRegistry.has(target)) {
    throw new ObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @ObjectType decorator`,
    );
  }

  const compiler = objectTypeRegistry.get(target);
  return compiler();
}
