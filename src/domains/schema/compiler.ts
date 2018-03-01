import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLOutputType,
} from 'graphql';
import { queryFieldsRegistry, schemaRegistry } from './registry';
import { SchemaError } from './error';
import { mapObject, isObjectType } from 'services/utils';

function validateSchemaTarget(target: Function) {
  if (!schemaRegistry.has(target)) {
    throw new SchemaError(target, `Schema target must be registered with @Schema`);
  }
  if (queryFieldsRegistry.isEmpty(target)) {
    throw new SchemaError(
      target,
      `Schema must have at least one field registered with @Query`,
    );
  }
}

function validateRootFieldType(
  target: Function,
  fieldName: string,
  type: GraphQLOutputType,
  rootFieldType: string,
) {
  if (!isObjectType(type)) {
    throw new SchemaError(
      target,
      `Root field ${rootFieldType}.${fieldName} is not compiled to GraphQLObjectType. Compiled type is '${type}'.`,
    );
  }
}

interface FieldsData {
  [fieldName: string]: () => GraphQLFieldConfig<any, any>;
}

function compileSchemaRootField(target: Function, name: string, fields: FieldsData) {
  const compiledFields = mapObject(fields, (compiler, fieldName) => {
    const compiledField = compiler();
    validateRootFieldType(target, fieldName, compiledField.type, name);
    return compiledField;
  });

  return new GraphQLObjectType({
    name,
    fields: compiledFields,
  });
}

export function compileSchema(target: Function) {
  validateSchemaTarget(target);
  const query = compileSchemaRootField(
    target,
    'Query',
    queryFieldsRegistry.getAll(target),
  );

  return new GraphQLSchema({
    query,
  });
}
