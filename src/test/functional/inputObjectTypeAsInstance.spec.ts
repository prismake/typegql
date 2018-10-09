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
} from '../..'

@InputObjectType()
class Input {
  @InputField()
  inputField: string

  someMethodOnInputObjectType() {
    return 'works'
  }
}

@ObjectType()
class Hello {
  @Field()
  bar(@Arg({ type: Input }) input: Input): string {
    return input.someMethodOnInputObjectType()
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }
}

const schema = compileSchema({ roots: [FooSchema] })

describe('input object type arguments are passed as instances', () => {
  it('passes as Input', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            bar(input: { inputField: "Foob" })
          }
        }
      `,
    )

    expect(result).toMatchSnapshot()
  })
})
