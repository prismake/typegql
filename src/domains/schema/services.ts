import { schemaRootsRegistry } from './registry'
import { SchemaRootError, SchemaCompilationError } from './error'
import { Constructable } from '../../services/types'

function hasDuplicates(arr: Function[]) {
  return new Set(arr).size !== arr.length
}

export function isSchemaRoot(base: Function) {
  return schemaRootsRegistry.has(base)
}

export function validateSchemaRoots(roots: Function[]) {
  if (hasDuplicates(roots)) {
    throw new SchemaCompilationError(
      `At least one schema root is provided more than once in schema roots`
    )
  }
  for (const root of roots) {
    if (!schemaRootsRegistry.has(root)) {
      throw new SchemaRootError(
        root,
        `Schema root must be registered with @SchemaRoot`
      )
    }
  }
}

const schemaRootInstances = new WeakMap<Function, Object>()

export function getSchemaRootInstance(schemaRootClass: Function) {
  if (!isSchemaRoot(schemaRootClass)) {
    return null
  }

  if (schemaRootInstances.has(schemaRootClass)) {
    return schemaRootInstances.get(schemaRootClass)
  }
  const instance = new (schemaRootClass as Constructable)()
  schemaRootInstances.set(schemaRootClass, instance)
  return instance
}
