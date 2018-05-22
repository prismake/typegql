import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql';
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  schemaRootsRegistry,
  RootFieldsRegistry,
} from './registry';
import { SchemaRootError } from './error';
import { showDeprecationWarning } from '~/services/utils';

function validateSchemaRoots(roots: Function[]) {
  for (let root of roots) {
    if (!schemaRootsRegistry.has(root)) {
      throw new SchemaRootError(root, `Schema root must be registered with @SchemaRoot`);
    }
  }
}

export interface CompileSchemaOptions {
  roots: Function[];
}

function getAllRootFieldsFromRegistry(
  roots: Function[],
  registry: RootFieldsRegistry,
  name: 'Query' | 'Mutation',
): GraphQLObjectType {
  const allRootFields: { [key: string]: GraphQLFieldConfig<any, any> } = {};
  for (let root of roots) {
    const rootFields = registry.getAll(root);
    Object.keys(rootFields).forEach(fieldName => {
      const fieldConfigGetter = rootFields[fieldName];
      const fieldConfig = fieldConfigGetter();

      // throw error if root field with this name is already registered
      if (!!allRootFields[fieldName]) {
        throw new SchemaRootError(
          root,
          `Duplicate of root field name: '${fieldName}'. Seems this name is also used inside other schema root.`,
        );
      }
      allRootFields[fieldName] = fieldConfig;
    });
  }

  const isEmpty = Object.keys(allRootFields).length < 1;

  if (isEmpty) {
    return null;
  }

  return new GraphQLObjectType({
    name,
    fields: allRootFields,
  });
}

export function compileSchema(config: CompileSchemaOptions | Function) {
  const roots = typeof config === 'function' ? [config] : config.roots;

  if (typeof config === 'function') {
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
    throw new Error('At least one of schema roots must have @Query root field.');
  }

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
  });
}
