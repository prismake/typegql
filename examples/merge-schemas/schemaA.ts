import { Schema, Query, compileSchema } from 'typegql';

@Schema()
class SchemaA {
  @Query()
  foo(name: string): string {
    return `bar, ${name}!`;
  }
}

export const schemaA = compileSchema(SchemaA);
