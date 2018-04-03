import { Schema, Query, compileSchema } from 'typegql';
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';

@Schema()
class MySchema {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`;
  }
}

const schema = compileSchema(MySchema);

export function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }
  const handler = graphqlLambda({ schema, tracing: true });
  return handler(event, context, callbackFilter);
}

export const graphiqlHandler = graphiqlLambda({ endpointURL: '/graphql' });
