import * as express from 'express';
import { Schema, Query, compileSchema } from 'typegql';
import * as graphqlHTTP from 'express-graphql';

@Schema()
class SuperSchema {
  @Query()
  hello(name: string): string {
    return `Hello, ${name}!`;
  }
}

const compiledSchema = compileSchema(SuperSchema);

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: compiledSchema,
    graphiql: true,
  }),
);
app.listen(3000);
