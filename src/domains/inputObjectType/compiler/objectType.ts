import { GraphQLInputObjectType, GraphQLInputFieldConfigMap } from 'graphql';
import { InputObjectTypeError, inputObjectTypeRegistry } from '../index';

import { compileAllInputFields, inputFieldsRegistry } from 'domains/inputField';
import { createCachedThunk } from 'services/utils';

const compileOutputTypeCache = new WeakMap<Function, GraphQLInputObjectType>();

export interface TypeOptions {
  name: string;
  description?: string;
}

function createTypeInputFieldsGetter(target: Function): () => GraphQLInputFieldConfigMap {
  if (inputFieldsRegistry.isEmpty(target)) {
    throw new InputObjectTypeError(target, `There are no fields inside this type.`);
  }

  return createCachedThunk(() => {
    return compileAllInputFields(target);
  });
}

export function compileInputObjectTypeWithConfig(
  target: Function,
  config: TypeOptions,
): GraphQLInputObjectType {
  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target);
  }

  const compiled = new GraphQLInputObjectType({
    ...config,
    fields: createTypeInputFieldsGetter(target),
  });

  compileOutputTypeCache.set(target, compiled);
  return compiled;
}

export function compileInputObjectType(target: Function) {
  if (!inputObjectTypeRegistry.has(target)) {
    throw new InputObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @InputObjectType decorator`,
    );
  }

  const compiler = inputObjectTypeRegistry.get(target);

  return compiler();
}
