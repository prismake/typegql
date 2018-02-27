import {
  GraphQLObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLNonNull,
  GraphQLList,
  GraphQLType,
} from 'graphql';
import { ObjectTypeError } from './error';
import { typeConfigRegistry } from './registry';

import { getAllRegisteredFields, compileAllFields } from 'domains/field';
import { createCachedThunk } from 'services/utils';

type CompiledType =
  | GraphQLObjectType
  | GraphQLList<GraphQLObjectType>
  | GraphQLNonNull<GraphQLObjectType>;

const compileTypeCache = new WeakMap<Function, CompiledType>();

export interface ObjectTypeOptions {
  name: string;
  description?: string;
  fields: any;
}

function createTypeFieldsGetter(target: Function) {
  const fields = getAllRegisteredFields(target);

  if (!fields) {
    throw new ObjectTypeError(target, `There are no fields inside this type.`);
  }

  return createCachedThunk(() => {
    return compileAllFields(target);
  });
}

export function compileType(target: Function) {
  if (compileTypeCache.has(target)) {
    return compileTypeCache.get(target);
  }

  if (!typeConfigRegistry.has(target)) {
    throw new ObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @Type decorator`,
    );
  }

  const { name, description, isList, isNonNull } = typeConfigRegistry.get(target);

  let compiled: GraphQLType = new GraphQLObjectType({
    name,
    description,
    fields: createTypeFieldsGetter(target),
  });

  if (isNonNull) {
    compiled = new GraphQLNonNull(compiled);
  }

  if (isList) {
    compiled = new GraphQLList(compiled);
  }

  compileTypeCache.set(target, compiled);
  return compiled;
}
