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
  Mutation,
} from '../..'

@InputObjectType()
class Input {
  @InputField()
  inputField: string

  someMethodOnInputObjectType() {
    return 'works' + this.inputField
  }
}

@ObjectType()
class Hello {
  @Field()
  bar(@Arg({ type: Input }) input: Input): string {
    return input.someMethodOnInputObjectType()
  }
  @Field()
  barWithList(@Arg({ type: [Input] }) inputs: Input[]): string {
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
  barMutation(@Arg({ type: Input }) input: Input): string {
    return input.someMethodOnInputObjectType()
  }
}

const schema = compileSchema({ roots: [FooSchema] })

describe('input object type arguments are passed as instances', () => {
  it('passes as Input', async () => {
    const result1 = await graphql(
      schema,
      `
        {
          hello {
            bar(input: { inputField: "Foo" })
          }
        }
      `,
    )

    expect(result1).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "hello": Object {
      "bar": "worksFoo",
    },
  },
}
`)

    const result2 = await graphql(
      schema,
      `
        {
          hello {
            barWithList(
              inputs: [{ inputField: "Foo1" }, { inputField: "Foo2" }]
            )
          }
        }
      `,
    )

    expect(result2).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "hello": Object {
      "barWithList": "worksFoo1|worksFoo2",
    },
  },
}
`)

    const result3 = await graphql(
      schema,
      `
        mutation {
          barMutation(input: { inputField: "Bar" })
        }
      `,
    )

    expect(result3).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "barMutation": "worksBar",
  },
}
`)
  })
})
