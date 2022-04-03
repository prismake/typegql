import { GraphQLUnionType, printSchema } from 'graphql'
import {
  ObjectType,
  Union,
  Field,
  compileObjectType,
  SchemaRoot,
  Query,
  compileSchema
} from '../..'

import 'jest'
import { resolveType } from '../../services/utils/gql/types/typeResolvers'

@ObjectType()
class Sub1 {
  @Field()
  bar: string
}

@ObjectType()
class Sub2 {
  @Field()
  bar: number
}

@Union({ types: [Sub1, Sub2] })
class UnionType {}

const customTypeResolver = jest.fn((type) => Sub1)

@Union({
  types: [Sub1, Sub2],
  resolveTypes: customTypeResolver
})
class CustomUnionType {}

@ObjectType()
class Foo {
  @Field({ type: UnionType })
  bar: Sub1 | Sub2

  @Field({ type: CustomUnionType })
  baz: Sub1 | Sub2
}

describe('Unions', () => {
  it('Registers returns proper enum type', () => {
    const { bar } = compileObjectType(Foo).getFields()
    expect(bar.type).toEqual(resolveType(UnionType))
    expect(bar.type).not.toEqual(UnionType)
  })

  it('Properly resolves type of union', () => {
    const { bar } = compileObjectType(Foo).getFields()

    const unionType = bar.type as GraphQLUnionType

    expect(
      unionType.resolveType &&
        // @ts-expect-error 3/21/2022
        unionType.resolveType(new Sub1(), null, null, null)
    ).toBe(resolveType(Sub1))
    expect(
      unionType.resolveType &&
        // @ts-expect-error 3/21/2022
        unionType.resolveType(new Sub2(), null, null, null)
    ).toBe(resolveType(Sub2))
  })

  it('Properly resolves with custom type resolver', () => {
    const { baz } = compileObjectType(Foo).getFields()

    const unionType = baz.type as GraphQLUnionType

    expect(
      unionType.resolveType &&
        // @ts-expect-error 3/21/2022
        unionType.resolveType(new Sub2(), null, null, null)
    ).toBe(resolveType(Sub1))
    expect(customTypeResolver).toBeCalled()
  })

  it('should work in a schema', async () => {
    @SchemaRoot()
    class FooSchema {
      @Query({ type: [UnionType] })
      aUnion() {}
    }
    const schema = compileSchema(FooSchema)

    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "type Query {
        aUnion: [UnionType!]!
      }

      union UnionType = Sub1 | Sub2

      type Sub1 {
        bar: String
      }

      type Sub2 {
        bar: Float
      }"
    `)
  })
})
