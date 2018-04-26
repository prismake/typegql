import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLOutputType,
  isOutputType,
} from 'graphql';
import { queryFieldsRegistry, mutationFieldsRegistry, schemaRegistry, FieldRegistry } from './registry';
import { SchemaError } from './error';
import { mapObject } from 'services/utils';
import { Map } from 'services/utils/mapObject';

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


function compileSchemaRootFieldIfNotEmpty(
  targets: Function[],
  name: string,
  registry: FieldRegistry
) {

  const compiledFields: Map<any> = {};

  targets.forEach((target) => {
    const fields = registry.getAll(target);
    Object.assign(compiledFields, mapObject(fields, (compiler, fieldName) => {
      const compiledField = compiler();
      validateRootFieldType(target, fieldName, compiledField.type, name);
      return compiledField;
    }))
  })

  const isEmpty = Object.keys(compiledFields).length === 0;

  if (isEmpty) {
    return null;
  }

  return new GraphQLObjectType({
    name,
    fields: compiledFields,
  });
}

export function compileSchema(targets: Function | Function[]) {
  if (typeof targets === "function") {
    targets = [targets];
  }

  const query = compileSchemaRootFieldIfNotEmpty(
    targets,
    'Query',
    queryFieldsRegistry
  );

  const mutation = compileSchemaRootFieldIfNotEmpty(
    targets,
    'Mutation',
    mutationFieldsRegistry
  );

  targets.forEach(validateSchemaTarget);

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
  });
}
