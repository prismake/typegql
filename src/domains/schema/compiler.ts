import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  RootFieldsRegistry,
} from './registry'
import { SchemaRootError } from './error'

import { validateSchemaRoots } from './services'

function getAllRootFieldsFromRegistry(
  roots: Function[],
  registry: RootFieldsRegistry,
  name: 'Query' | 'Mutation',
): GraphQLObjectType {
  const allRootFields: { [key: string]: GraphQLFieldConfig<any, any> } = {}
  for (let root of roots) {
    const rootFields = registry.getAll(root)
    Object.keys(rootFields).forEach((fieldName) => {
      const fieldConfigGetter = rootFields[fieldName]
      const fieldConfig = fieldConfigGetter()
      console.log('fieldConfig: ', fieldConfig)

      // throw error if root field with this name is already registered
      if (!!allRootFields[fieldName]) {
        throw new SchemaRootError(
          root,
          `Duplicate of root field name: '${fieldName}'. Seems this name is also used inside other schema root.`,
        )
      }
      allRootFields[fieldName] = fieldConfig
    })
  }

  const isEmpty = Object.keys(allRootFields).length < 1

  if (isEmpty) {
    return null
  }

  return new GraphQLObjectType({
    name,
    fields: allRootFields,
  })
}

export function compileSchema(schemaOrSchemas: Function | Function[]) {
  const roots = Array.isArray(schemaOrSchemas)
    ? schemaOrSchemas
    : [schemaOrSchemas]

  validateSchemaRoots(roots)

  const query = getAllRootFieldsFromRegistry(
    roots,
    queryFieldsRegistry,
    'Query',
  )
  const mutation = getAllRootFieldsFromRegistry(
    roots,
    mutationFieldsRegistry,
    'Mutation',
  )

  if (!query) {
    throw new Error('At least one of schema roots must have @Query root field.')
  }

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
  })
}
