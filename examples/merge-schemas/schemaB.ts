import { Schema, Query, compileSchema } from 'decapi'

@Schema()
class SchemaB {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`
  }
}

export const schemaB = compileSchema(SchemaB)
