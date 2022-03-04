import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  RootFieldsRegistry
} from './registry'
import { SchemaRootError } from './error'

import { validateSchemaRoots } from './services'
import {
  interfaceClassesSet,
  interfaceTypeImplementors
} from '../interfaceType/interfaceTypeRegistry'
import { objectTypeRegistry } from '../objectType/registry'

function getAllRootFieldsFromRegistry(
  roots: Function[],
  registry: RootFieldsRegistry,
  name: 'Query' | 'Mutation'
): GraphQLObjectType | null {
  const allRootFields: { [key: string]: GraphQLFieldConfig<any, any> } = {}
  for (const root of roots) {
    const rootFields = registry.getAll(root)
    Object.keys(rootFields).forEach((fieldName) => {
      const fieldConfigGetter = rootFields[fieldName]
      const fieldConfig = fieldConfigGetter()

      // throw error if root field with this name is already registered
      if (!!allRootFields[fieldName]) {
        throw new SchemaRootError(
          root,
          `Duplicate of root field name: '${fieldName}'. Seems this name is also used inside other schema root.`
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
    fields: allRootFields
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
    'Query'
  )

  const mutation = getAllRootFieldsFromRegistry(
    roots,
    mutationFieldsRegistry,
    'Mutation'
  )

  if (!query) {
    throw new Error('At least one of schema roots must have @Query root field.')
  }

  const extraTypes: GraphQLObjectType[] = []
  Array.from(interfaceClassesSet).forEach((interfaceClass) => {
    const implementorClasses = interfaceTypeImplementors.get(interfaceClass)
    if (Array.isArray(implementorClasses)) {
      implementorClasses.forEach((implementorClass) => {
        const implementor = objectTypeRegistry.get(implementorClass)()
        extraTypes.push(implementor)
      })
    } else {
      throw new Error(
        `interface type ${interfaceClass.name} doesn't have any implementors`
      )
    }
  })

  return new GraphQLSchema({
    query: query || undefined,
    mutation: mutation || undefined,
    types: extraTypes
  })
}
