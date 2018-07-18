import { GraphQLInterfaceType } from 'graphql';
import { InterfaceTypeError, interfaceTypeRegistry } from '../index';

import { compileAllFields, fieldsRegistry } from '~/domains/field';
import {
  createCachedThunk,
  getClassWithAllParentClasses,
} from '~/services/utils';

const compileOutputTypeCache = new WeakMap<Function, GraphQLInterfaceType>();

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
    throw new InterfaceTypeError(
      target,
      `There are no fields inside this type.`,
    );
  }

  return createCachedThunk(() => {
    return compileAllFields(target);
  });
}

export function compileInterfaceTypeWithConfig(
  target: Function,
  config: TypeOptions,
): GraphQLInterfaceType {
  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target);
  }

  const compiled = new GraphQLInterfaceType({
    ...config,
    // isTypeOf: value => value instanceof target,
    fields: createTypeFieldsGetter(target),
  });

  compileOutputTypeCache.set(target, compiled);
  return compiled;
}

export function compileInterfaceType(target: Function) {
  if (!interfaceTypeRegistry.has(target)) {
    throw new InterfaceTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @ObjectType decorator`,
    );
  }

  const compiler = interfaceTypeRegistry.get(target);
  return compiler();
}
