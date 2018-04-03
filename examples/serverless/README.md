## Serverless example

This example presents how to deploy graphql schema based on typegql to serverless infrastructure like AWS lambda.

Schema is very simple:

```graphql
query {
  hello(name: "Bob") # will resolve to 'Hello, Bob!'
}
```

As schema compiled by `compileSchema` is regular, normal GraphQLSchema, we can simply use it with `apollo-server-lambda` that will handle everything.

```typescript
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
```
