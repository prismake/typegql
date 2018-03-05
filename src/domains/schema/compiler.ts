import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLOutputType,
  isOutputType,
} from 'graphql';
import { queryFieldsRegistry, mutationFieldsRegistry, schemaRegistry } from './registry';
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
  // return true;
  if (!isOutputType(type)) {
    throw new SchemaError(
      target,
      `Root field ${rootFieldType}.${fieldName} is not compiled to GraphQLOutputType. Compiled type is '${type}'.`,
    );
  }
}

interface FieldsData {
  [fieldName: string]: () => GraphQLFieldConfig<any, any>;
}

function compileSchemaRootFieldIfNotEmpty(
  target: Function,
  name: string,
  fields: FieldsData,
) {
  const compiledFields = mapObject(fields, (compiler, fieldName) => {
    const compiledField = compiler();
    validateRootFieldType(target, fieldName, compiledField.type, name);
    return compiledField;
  });

  const isEmpty = Object.keys(compiledFields).length <= 0;

  if (isEmpty) {
    return null;
  }

  return new GraphQLObjectType({
    name,
    fields: compiledFields,
  });
}

export function compileSchema(target: Function) {
  const query = compileSchemaRootFieldIfNotEmpty(
    target,
    'Query',
    queryFieldsRegistry.getAll(target),
  );

  const mutation = compileSchemaRootFieldIfNotEmpty(
    target,
    'Mutation',
    mutationFieldsRegistry.getAll(target),
  );

  validateSchemaTarget(target);

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
  });
}
