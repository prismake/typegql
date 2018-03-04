import {
  GraphQLType,
  isInputType,
  GraphQLInputType,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
} from 'graphql';
import { getClassWithAllParentClasses } from 'services/utils';
import { InputFieldError, inputFieldsRegistry } from '../index';

import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType';

function getFinalInputFieldType(target: Function, fieldName: string, forcedType?: any) {
  if (forcedType) {
    return resolveTypeOrThrow(forcedType, target, fieldName);
  }
  return inferTypeOrThrow(target, fieldName);
}

function validateResolvedType(
  target: Function,
  fieldName: string,
  type: GraphQLType,
): type is GraphQLInputType {
  if (!isInputType(type)) {
    throw new InputFieldError(
      target,
      fieldName,
      `Validation of type failed. Resolved type for @Field must be GraphQLInputType.`,
    );
  }
  return true;
}

export function compileInputFieldConfig(
  target: Function,
  fieldName: string,
): GraphQLInputFieldConfig {
  const { type, description, defaultValue } = inputFieldsRegistry.get(target, fieldName);

  const resolvedType = getFinalInputFieldType(target, fieldName, type);

  if (!validateResolvedType(target, fieldName, resolvedType)) {
    return;
  }

  return {
    description,
    defaultValue,
    type: resolvedType,
  };
}

export function compileAllInputFieldsForSingleTarget(target: Function) {
  const fields = inputFieldsRegistry.getAll(target);
  const finalFieldsMap: GraphQLInputFieldConfigMap = {};
  Object.keys(fields).forEach(fieldName => {
    const config = inputFieldsRegistry.get(target, fieldName);
    finalFieldsMap[config.name] = compileInputFieldConfig(target, fieldName);
  });
  return finalFieldsMap;
}

export function compileAllInputFields(target: Function) {
  const targetWithParents = getClassWithAllParentClasses(target);
  const finalFieldsMap: GraphQLInputFieldConfigMap = {};

  targetWithParents.forEach(targetLevel => {
    Object.assign(finalFieldsMap, compileAllInputFieldsForSingleTarget(targetLevel));
  });
  return finalFieldsMap;
}
