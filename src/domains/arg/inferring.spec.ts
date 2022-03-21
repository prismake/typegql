import { GraphQLString, GraphQLFloat, GraphQLNonNull, graphql } from 'graphql'
import { GraphQLDateTime } from 'graphql-scalars'
import {
  ObjectType,
  Field,
  compileObjectType,
  SchemaRoot,
  Query,
  compileSchema,
  ArgNullable
} from '../..'

describe('Arguments', () => {
  it('Infers basic arguments without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string): string {
        return baz
      }
    }
    const { bar } = compileObjectType(Foo).getFields()

    expect(bar.args.length).toBeGreaterThan(0)
    const [bazArg] = bar.args
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString))
    expect(bazArg.name).toBe('baz')
  })

  it('Throws if not able to infer argument type without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: any): string {
        return baz
      }
    }
    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingInlineSnapshot(
      `"@Type Foo.bar(baz <-------): Could not infer type of argument. Make sure to use native GraphQLInputType, native scalar like 'String' or class decorated with @InputObjectType"`
    )
  })

  it('Infers multiple basic arguments without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string, boo: number): string {
        return baz
      }
      @Field()
      dateField(date: Date): Date {
        return date
      }
    }
    const { bar, dateField } = compileObjectType(Foo).getFields()

    expect(bar.args.length).toEqual(2)
    const [bazArg, booArg] = bar.args
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString))
    expect(bazArg.name).toEqual('baz')
    expect(booArg.name).toEqual('boo')
    expect(booArg.type).toEqual(new GraphQLNonNull(GraphQLFloat))

    expect(dateField.args.length).toEqual(1)
    const [date] = dateField.args

    expect(date.type).toEqual(new GraphQLNonNull(GraphQLDateTime))
    expect(date.name).toEqual('date')
  })

  it('Does not break on Date when explicit type of Date is specified', async () => {
    @ObjectType()
    class Foo {
      @Field()
      dateField(@ArgNullable({ type: Date }) date?: Date): Date | undefined {
        expect(date instanceof Date).toBeTruthy()

        return date
      }
    }
    const { dateField } = compileObjectType(Foo).getFields()

    expect(dateField.args.length).toEqual(1)
    const [date] = dateField.args

    expect(date.type).toEqual(GraphQLDateTime)
    expect(date.name).toEqual('date')

    @SchemaRoot()
    class FooSchema {
      @Query({ type: Foo })
      foo() {
        return {}
      }
    }

    const schema = compileSchema(FooSchema)

    const result = await graphql({
      schema,
      source: `
        {
          foo {
            dateField(date: "2021-03-18T08:25:44.982Z")
          }
        }
      `
    })

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "foo": Object {
            "dateField": 2021-03-18T08:25:44.982Z,
          },
        },
      }
    `)
  })
})
