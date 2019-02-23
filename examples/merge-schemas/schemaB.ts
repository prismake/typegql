import { SchemaRoot, Query, compileSchema } from 'decapi'

@SchemaRoot()
class SchemaB {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`
  }
}

export const schemaB = compileSchema(SchemaB)
