import { GraphQLFieldConfig, GraphQLFieldConfigMap, isOutputType } from 'graphql';
import { getRegisteredField, getAllRegisteredFields, FieldError } from '../index';

import { compileFieldResolver } from './resolver';
import { compileFieldType } from './fieldType';
import { compileFieldArgs } from 'domains/arg';

export function compileFieldConfig(
  target: Function,
  fieldName: string,
): GraphQLFieldConfig<any, any, any> {
  const config = getRegisteredField(target, fieldName);
  const args = compileFieldArgs(target, fieldName);

  const type = compileFieldType(target, fieldName);

  if (!isOutputType(type)) {
    throw new FieldError(target, fieldName, `Output type required`);
  }

  return {
    description: config.description,
    type,
    resolve: compileFieldResolver(target, fieldName),
    args,
  };
}

export function compileAllFields(target: Function) {
  const fields = getAllRegisteredFields(target);
  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {};
  Object.keys(fields).forEach(fieldName => {
    const config = getRegisteredField(target, fieldName);
    finalFieldsMap[config.name] = compileFieldConfig(target, fieldName);
  });
  return finalFieldsMap;
}
