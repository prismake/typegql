import express from 'express'
import { GraphQLResolveInfo } from 'graphql'
import getFieldNames from 'graphql-list-fields'
import { Schema, Query, ObjectType, Field, Inject, compileSchema } from 'decapi'
import graphqlHTTP from 'express-graphql'

function NeededFields(filter: string[] = []) {
  return Inject(({ info }) => {
    const selectionFieldNames: string[] = getFieldNames(info) // let's get all needed fields

    // if there is no filter, return all selected field names
    if (!filter || !filter.length) {
      return selectionFieldNames
    }

    // let's return only those allowed
    return selectionFieldNames.filter((fieldName) => {
      return filter.includes(fieldName)
    })
  })
}

// let's create some object that is aware of fields that it needs to know about
@ObjectType()
class LazyObject {
  @Field()
  foo: string
  @Field()
  bar: string

  constructor(neededFields: string[]) {
    console.log(
      'I will only perform expensive operations for fields:',
      neededFields
    )

    if (neededFields.includes['foo']) {
      this.foo = 'I have foo'
    }

    if (neededFields.includes['bar']) {
      this.bar = 'I have bar'
    }
  }
}

@Schema()
class SuperSchema {
  @Query()
  foo(
    @NeededFields(['foo', 'bar']) neededFields: string[] // this arg will tell if `foo` and `bar` are needed
  ): LazyObject {
    console.log('Needed fields are: ', { neededFields })
    return new LazyObject(neededFields)
  }
}

const compiledSchema = compileSchema(SuperSchema)

const app = express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: compiledSchema,
    graphiql: true
  })
)
app.listen(3000)
