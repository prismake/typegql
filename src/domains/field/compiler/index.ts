import { GraphQLFieldConfig, GraphQLFieldConfigMap } from 'graphql';
import { getRegisteredField, getAllRegisteredFields } from '../index';

import { compileFieldResolver } from './resolver';
import { compileFieldType } from './fieldType';
import { compileFieldArgs } from 'domains/arg';

export function compileFieldConfig(
  target: Function,
  fieldName: string,
): GraphQLFieldConfig<any, any, any> {
  const config = getRegisteredField(target, fieldName);
  const args = compileFieldArgs(target, fieldName);

  return {
    description: config.description,
    type: compileFieldType(target, fieldName),
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
