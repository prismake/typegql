import {
  Query,
  SchemaRoot,
  compileSchema,
  ObjectType,
  Field,
  Mutation
} from '../..'
import {
  graphql,
  introspectionQuery,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql'

describe('@SchemaRoot', () => {
  it('should not allow compiling schema not decorated with @Schema', () => {
    class Foo {}

    expect(() => compileSchema([Foo])).toThrowErrorMatchingSnapshot()
  })

  it('should not allow @Schema without any @Query field', () => {
    @SchemaRoot()
    class Foo {}

    expect(() => compileSchema([Foo])).toThrowErrorMatchingSnapshot()
  })

  it('should generate all schema fields properly for valid schema', async () => {
    @ObjectType()
    class Hello {
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

    const schema = compileSchema([FooSchema])

    expect(await graphql(schema, introspectionQuery)).toMatchSnapshot()
  })

  it('should allow schema to be compiled from multiple roots', async () => {
    @SchemaRoot()
    class FooSchema {
      @Query()
      foo(): string {
        return 'foo'
      }
    }

    @SchemaRoot()
    class BarSchema {
      @Query()
      bar(): number {
        return 42
      }
    }

    const schema = compileSchema([FooSchema, BarSchema])

    const queryType = schema.getQueryType() as GraphQLObjectType

    const { foo, bar } = queryType.getFields()

    expect(foo.name).toEqual('foo')
    expect(foo.type).toEqual(GraphQLString)

    expect(bar.name).toEqual('bar')
    expect(bar.type).toEqual(GraphQLFloat)
  })

  it('should allow schema root with mutations only if there is other root with queries', async () => {
    @SchemaRoot()
    class FooSchema {
      @Query()
      foo(): string {
        return 'foo'
      }
    }

    @SchemaRoot()
    class BarSchema {
      @Mutation()
      bar(): number {
        return 42
      }
    }

    const schema = compileSchema([FooSchema, BarSchema])

    const queryType = schema.getQueryType() as GraphQLObjectType
    const mutationType = schema.getMutationType() as GraphQLObjectType

    const { foo } = queryType.getFields()
    const { bar } = mutationType.getFields()

    expect(foo.name).toEqual('foo')
    expect(foo.type).toEqual(GraphQLString)

    expect(bar.name).toEqual('bar')
    expect(bar.type).toEqual(GraphQLFloat)
  })

  it('should not allow schema that has only mutation fields', async () => {
    @SchemaRoot()
    class FooSchema {
      @Mutation()
      foo(): string {
        return 'foo'
      }
    }

    @SchemaRoot()
    class BarSchema {
      @Mutation()
      bar(): number {
        return 42
      }
    }

    expect(() =>
      compileSchema([FooSchema, BarSchema])
    ).toThrowErrorMatchingSnapshot()
  })

  it('will not allow multiple schema roots to have conflicting root field names', async () => {
    @SchemaRoot()
    class FooSchema {
      @Query()
      foo(): string {
        return 'foo'
      }
    }

    @SchemaRoot()
    class BarSchema {
      @Query()
      foo(): number {
        return 42
      }
    }

    expect(() =>
      compileSchema([FooSchema, BarSchema])
    ).toThrowErrorMatchingSnapshot()
  })

  it('will not allow schema with incorrect object types', async () => {
    @ObjectType()
    class Hello {
      @Field()
      async world(name: string): Promise<string> {
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

    expect(() => compileSchema([FooSchema])).toThrowErrorMatchingSnapshot()
  })

  it('should support schema root instance properties', async () => {
    @SchemaRoot()
    class FooSchema {
      private bar: number = 42

      @Query()
      foo(): number {
        return this.bar
      }
    }

    const schema = compileSchema([FooSchema])

    const result = await graphql(
      schema,
      `
        {
          foo
        }
      `
    )

    expect(result.data.foo).toEqual(42)
  })

  it('should call schema root constructor', async () => {
    const constructorCall = jest.fn()
    @SchemaRoot()
    class FooSchema {
      constructor() {
        constructorCall()
      }

      @Query()
      foo(): number {
        return 42
      }
    }

    const schema = compileSchema([FooSchema])

    await graphql(
      schema,
      `
        {
          foo
        }
      `
    )

    expect(constructorCall).toBeCalled()
  })

  it('will not allow two @Query on a single class method', async () => {
    expect(() => {
      @SchemaRoot()
      class BarSchema {
        @Query()
        @Query()
        fooa(): number {
          return 42
        }
      }
      compileSchema([BarSchema])
    }).toThrowErrorMatchingInlineSnapshot(
      `"Root field \\"fooa\\" on schema class BarSchema cannot be registered as a query-it's already registered"`
    )
  })
  it('will allow both @Mutation and @Query on a single class method', async () => {
    @SchemaRoot()
    class BarSchema {
      @Query()
      @Mutation()
      foo(): number {
        return 42
      }
    }

    expect(() => compileSchema([BarSchema])).not.toThrow()
  })
})
