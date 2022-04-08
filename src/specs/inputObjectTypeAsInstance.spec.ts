import { graphql } from 'graphql'
import {
  ObjectType,
  Field,
  Arg,
  SchemaRoot,
  Query,
  compileSchema,
  InputObjectType,
  InputField,
  Mutation
} from '../index'
import { GraphQLDateTime } from 'graphql-scalars'

@InputObjectType()
class MyInput {
  @InputField()
  inputField: string

  someMethodOnInputObjectType() {
    return 'works' + this.inputField
  }
}

@ObjectType()
class Hello {
  @Field()
  bar(@Arg() input: MyInput): string {
    return input.someMethodOnInputObjectType()
  }
  @Field()
  barWithList(@Arg({ type: [MyInput] }) inputs: MyInput[]): string {
    return inputs
      .map((input) => {
        return input.someMethodOnInputObjectType()
      })
      .join('|')
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }

  @Mutation()
  barMutation(@Arg({ type: MyInput }) input: MyInput): string {
    return input.someMethodOnInputObjectType()
  }

  @Query()
  withScalar(
    @Arg({ type: GraphQLDateTime, isNullable: true }) aDate: Date
  ): number {
    return aDate.getTime()
  }
}

const schema = compileSchema(FooSchema)

describe('input object type arguments are passed as instances', () => {
  it('passes as Input', async () => {
    const result1 = await graphql({
      schema,
      source: `
        {
          hello {
            bar(input: { inputField: "Foo" })
          }
        }
      `
    })

    expect(result1).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "hello": Object {
      "bar": "worksFoo",
    },
  },
}
`)

    const result2 = await graphql({
      schema,
      source: `
        {
          hello {
            barWithList(
              inputs: [{ inputField: "Foo1" }, { inputField: "Foo2" }]
            )
          }
        }
      `
    })

    expect(result2).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "hello": Object {
      "barWithList": "worksFoo1|worksFoo2",
    },
  },
}
`)

    const result3 = await graphql({
      schema,
      source: `
        mutation {
          barMutation(input: { inputField: "Bar" })
        }
      `
    })

    expect(result3).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "barMutation": "worksBar",
  },
}
`)
  })

  it('should work with scalars', async () => {
    const result2 = await graphql({
      schema,
      source: `
        {
          withScalar(aDate: "2018-10-10T23:37:34+02:00")
        }
      `
    })

    expect(result2).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "withScalar": 1539207454000,
  },
}
`)
  })
})
