import { SchemaRoot, Query, compileSchema } from 'decapi'
import { ApolloServer } from 'apollo-server-lambda'

@SchemaRoot()
class MySchema {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`
  }
}

const schema = compileSchema(MySchema)
const server = new ApolloServer({ schema, tracing: true })
const handler = server.createHandler()

export const graphiqlHandler = handler
export const graphqlHandler = handler
