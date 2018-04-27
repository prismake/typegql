import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLOutputType,
  isOutputType,
} from 'graphql';
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  schemaRootsRegistry,
  RootFieldsRegistry,
} from './registry';
import { SchemaError } from './error';
import { mapObject, showDeprecationWarning } from 'services/utils';

function validateSchemaRoots(roots: Function[]) {
  for (let root of roots) {
    if (!schemaRootsRegistry.has(root)) {
      throw new SchemaError(root, `Schema root must be registered with @SchemaRoot`);
    }
  }
}

interface CompileSchemaOptions {
  roots: Function[];
}

function getAllRootFieldsFromRegistry(
  roots: Function[],
  registry: RootFieldsRegistry,
  name: 'Query' | 'Mutation',
): GraphQLObjectType {
  const allQueryFields: { [key: string]: GraphQLFieldConfig<any, any> } = {};
  for (let root of roots) {
    const rootFields = registry.getAll(root);
    Object.keys(rootFields).forEach(fieldName => {
      const fieldConfigGetter = rootFields[fieldName];
      const fieldConfig = fieldConfigGetter();
      allQueryFields[fieldName] = fieldConfig;
    });
  }

  const isEmpty = Object.keys(allQueryFields).length < 1;

  if (isEmpty) {
    return null;
  }

  return new GraphQLObjectType({
    name,
    fields: allQueryFields,
  });
}

export function compileSchema(config: CompileSchemaOptions | Function) {
  const roots = typeof config === 'function' ? [config] : config.roots;

  if (typeof config === 'function') {
    console.warn(``);
    showDeprecationWarning(
      `Passing schema root to compileSchema is deprecated. Use config object with 'roots' field. compileSchema(SchemaRoot) --> compileSchema({ roots: [SchemaRoot] })`,
      config,
    );
  }

  validateSchemaRoots(roots);

  const query = getAllRootFieldsFromRegistry(roots, queryFieldsRegistry, 'Query');
  const mutation = getAllRootFieldsFromRegistry(
    roots,
    mutationFieldsRegistry,
    'Mutation',
  );

  if (!query) {
    throw new Error('At least one of schema roots must have at least one @Query field.');
  }

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
  });
}
