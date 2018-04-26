import * as express from 'express';
import { Schema, Query, compileSchema } from 'typegql';
import * as graphqlHTTP from 'express-graphql';
import { mergeSchemas } from 'graphql-tools';

import { schemaA } from './schemaA';
import { schemaB } from './schemaB';
import { graphql } from 'graphql';

const mergedSchema = mergeSchemas({ schemas: [schemaA, schemaB] });

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: mergedSchema,
    graphiql: true,
  }),
);
app.listen(3000, () => {
  console.log('Api ready on port 3000');
});
