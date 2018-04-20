import * as express from 'express';
import { Schema, Query, compileSchema } from 'typegql';
import * as graphqlHTTP from 'express-graphql';

import { schema } from './schema';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
app.listen(3000, () => {
  console.log('Api ready on port 3000');
});
