import { graphql } from 'graphql'
import { ObjectType, Field, SchemaRoot, Query, compileSchema } from '../..'

@ObjectType()
class Mixin {
  @Field()
  mixinMethod(this: Hello, a: string): string {
    expect(this.myProp).toBe(5)
    return `hello from mixin ${a}`
  }
}

@ObjectType({ mixins: [Mixin] })
class Hello {
  myProp = 5
  @Field()
  world(name: string): string {
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

const schema = compileSchema({ roots: [FooSchema] })

describe('Query a mixin method', () => {
  it('executes and field method has correct context', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            mixinMethod(a: "Bob")
          }
        }
      `,
    )

    expect(result).toMatchSnapshot()
  })
})
