import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  isOutputType,
  GraphQLType,
  GraphQLOutputType,
} from 'graphql';
import { FieldError, fieldsRegistry } from '../index';

import { compileFieldResolver } from './resolver';
import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType';
import { compileFieldArgs } from 'domains/arg';

function getFinalFieldType(target: Function, fieldName: string, forcedType?: any) {
  if (forcedType) {
    return resolveTypeOrThrow(forcedType, target, fieldName);
  }
  return inferTypeOrThrow(target, fieldName);
}

function validateResolvedType(
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

export function compileFieldConfig(
  target: Function,
  fieldName: string,
): GraphQLFieldConfig<any, any, any> {
  const { type, description } = fieldsRegistry.get(target, fieldName);
  const args = compileFieldArgs(target, fieldName);

  const resolvedType = getFinalFieldType(target, fieldName, type);

  if (!validateResolvedType(target, fieldName, resolvedType)) {
    return;
  }

  return {
    description,
    type: resolvedType,
    resolve: compileFieldResolver(target, fieldName),
    args,
  };
}

export function compileAllFields(target: Function) {
  const fields = fieldsRegistry.getAll(target);
  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {};
  Object.keys(fields).forEach(fieldName => {
    const config = fieldsRegistry.get(target, fieldName);
    finalFieldsMap[config.name] = compileFieldConfig(target, fieldName);
  });
  return finalFieldsMap;
}
