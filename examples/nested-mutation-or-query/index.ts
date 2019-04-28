import express from 'express'
import graphqlHTTP from 'express-graphql'

import { schema } from './schema'
import cors from 'cors'

const app = express()
app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)
app.listen(3000, () => {
  console.log('Api ready on port 3000')
})
