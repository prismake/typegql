import { SchemaRoot, Query, compileSchema } from 'decapi'

@SchemaRoot()
class MySchema {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`
  }
}

export const schema = compileSchema(MySchema)
