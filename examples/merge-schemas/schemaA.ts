import { SchemaRoot, Query, compileSchema } from 'decapi'

@SchemaRoot()
class SchemaA {
  @Query()
  foo(name: string): string {
    return `bar, ${name}!`
  }
}

export const schemaA = compileSchema(SchemaA)
