import { graphql } from 'graphql'
import {
  registerEnum,
  ObjectType,
  Field,
  Arg,
  SchemaRoot,
  Query,
  compileSchema
} from '../index'

export enum TestEnum {
  Foo = 'Foo',
  Bar = 'Bar',
  Baz = 'Baz'
}

registerEnum(TestEnum, { name: 'TestEnum' })

@ObjectType()
class Hello {
  @Field()
  world(@Arg({ type: TestEnum }) name: TestEnum): string {
    return `Hello, ${name}`
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }
}

const schema = compileSchema(FooSchema)

describe('Query with enums', () => {
  it('Will guard proper enum values', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            world(name: Foob)
          }
        }
      `
    )

    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: Expected type TestEnum, found Foob. Did you mean the enum value Foo?],
      ]
    `)
  })
})
