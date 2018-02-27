import { isType, GraphQLOutputType } from 'graphql';
import { Thunk, AnyClass } from 'services/types';
import { typeConfigRegistry, compileType } from 'domains/type';
import { enumsRegistry } from 'domains/enum';
import { parseTypeToGraphql, BasicScalar, isBasicScalar } from './parseNative';

export type ResolvableType = Thunk<GraphQLOutputType | AnyClass | BasicScalar | Object>;

export function resolveType(type: ResolvableType, allowThunk = true): GraphQLOutputType {
  if (isType(type)) {
    return type;
  }

  if (isBasicScalar(type)) {
    return parseTypeToGraphql(type);
  }

  if (enumsRegistry.has(type)) {
    return enumsRegistry.get(type);
  }

  if (typeof type === 'object') {
    return;
  }

  if (typeConfigRegistry.has(type)) {
    return compileType(type);
  }

  if (!allowThunk || typeof type !== 'function') {
    return;
  }

  return resolveType(type(), false);
}
