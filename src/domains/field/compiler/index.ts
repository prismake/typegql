import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  isOutputType,
  GraphQLType,
  GraphQLOutputType,
  GraphQLNonNull,
} from 'graphql';
import { getClassWithAllParentClasses } from 'services/utils/inheritance';
import { FieldError, fieldsRegistry } from '../index';

import { compileFieldResolver } from './resolver';
import { resolveTypeOrThrow, inferTypeOrThrow } from './fieldType';
import { compileFieldArgs } from 'domains/arg';
import {
  schemaRegistry,
  mutationFieldsRegistry,
  queryFieldsRegistry,
} from 'domains/schema';

function resolveRegisteredOrInferedType(
  target: Function,
  fieldName: string,
  forcedType?: any,
) {
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

function enhanceType(originalType: GraphQLOutputType, isNullable: boolean) {
  let finalType = originalType;
  if (!isNullable) {
    finalType = new GraphQLNonNull(finalType);
  }
  return finalType;
}

export function compileFieldConfig(
  target: Function,
  fieldName: string,
): GraphQLFieldConfig<any, any, any> {
  const { type, description, isNullable } = fieldsRegistry.get(target, fieldName);
  const args = compileFieldArgs(target, fieldName);

  const resolvedType = resolveRegisteredOrInferedType(target, fieldName, type);

  if (!validateResolvedType(target, fieldName, resolvedType)) {
    return;
  }

  const finalType = enhanceType(resolvedType, isNullable);

  return {
    description,
    type: finalType,
    resolve: compileFieldResolver(target, fieldName),
    args,
  };
}

function isRootFieldOnNonRootBase(base: Function, fieldName: string) {
  const isRoot = schemaRegistry.has(base);
  if (isRoot) {
    return false;
  }
  if (mutationFieldsRegistry.has(base, fieldName)) {
    return true;
  }
  if (queryFieldsRegistry.has(base, fieldName)) {
    return true;
  }
  return false;
}

function getAllFields(target: Function) {
  const fields = fieldsRegistry.getAll(target);
  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {};
  Object.keys(fields).forEach(fieldName => {
    if (isRootFieldOnNonRootBase(target, fieldName)) {
      throw new FieldError(
        target,
        fieldName,
        `Given field is root field (@Query or @Mutation) not registered inside @Schema type. `,
      );
    }

    const config = fieldsRegistry.get(target, fieldName);
    finalFieldsMap[config.name] = compileFieldConfig(target, fieldName);
  });
  return finalFieldsMap;
}

export function compileAllFields(target: Function) {
  const targetWithParents = getClassWithAllParentClasses(target);

  const finalFieldsMap: GraphQLFieldConfigMap<any, any> = {};

  targetWithParents.forEach(targetLevel => {
    Object.assign(finalFieldsMap, getAllFields(targetLevel));
  });
  return finalFieldsMap;
}
