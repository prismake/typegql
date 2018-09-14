import { GraphQLObjectType } from 'graphql';
import { ObjectTypeError, objectTypeRegistry } from '../index';

import { fieldsRegistry, compileAllFields } from '../../field';
import {
  getClassWithAllParentClasses,
  createCachedThunk,
} from '../../../services/utils';

const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>();

export interface TypeOptions {
  name: string;
  description?: string;
  mixins?: any[];
}

function createTypeFieldsGetter(target: Function, mixins: any[] = []) {
  const targetWithParents = getClassWithAllParentClasses(target).concat(mixins);
  console.log('targetWithParents: ', targetWithParents);

  const hasFields = targetWithParents.some((ancestor) => {
    return !fieldsRegistry.isEmpty(ancestor);
  });

  if (!hasFields) {
    throw new ObjectTypeError(target, `There are no fields inside this type.`);
  }

  return createCachedThunk(() => {
    return compileAllFields(targetWithParents);
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
    name: config.name,
    description: config.description,
    isTypeOf: (value: any) => value instanceof target,
    fields: createTypeFieldsGetter(target, config.mixins),
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
