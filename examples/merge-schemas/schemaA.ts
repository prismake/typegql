import { Schema, Query, compileSchema } from 'decapi'

@Schema()
class SchemaA {
  @Query()
  foo(name: string): string {
    return `bar, ${name}!`
  }
}

export const schemaA = compileSchema(SchemaA)
