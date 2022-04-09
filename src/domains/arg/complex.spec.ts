import { GraphQLNonNull, getNamedType, GraphQLString } from 'graphql'
import {
  InputField,
  ObjectType,
  Field,
  compileObjectType,
  InputObjectType,
  compileInputObjectType,
  Arg
} from '../..'

describe('Complex arguments', () => {
  it('should not allow complex argument type not decorated with @InputObjectType', async () => {
    class InputOne {
      @InputField()
      bar: string
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(input: InputOne): string {
        return 'ok'
      }
    }
    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingSnapshot()
  })

  it('should not allow complex argument type decorated with @ObjectType', async () => {
    @ObjectType()
    class InputTwo {
      @Field()
      bar: string
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(input: InputTwo): string {
        return 'ok'
      }
    }

    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingSnapshot()
  })
  it('Supports complex input types', async () => {
    @InputObjectType()
    class Input {
      @InputField()
      bar: string
    }

    @ObjectType()
    class Foo {
      @Field()
      nonNullable(input: Input): string {
        return 'ok'
      }
      @Field()
      nullable(input: Input | null): string {
        return 'ok'
      }
    }
    const { nonNullable, nullable } = compileObjectType(Foo).getFields()
    expect(nonNullable.args[0].type).toEqual(
      new GraphQLNonNull(compileInputObjectType(Input))
    )
    expect(nullable.args[0].type).toEqual(compileInputObjectType(Input))
  })

  it('Supports scalar list argument type', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(@Arg({ type: [String] }) input: string[]): string {
        return 'ok'
      }
    }
    const { bar } = compileObjectType(Foo).getFields()
    const argType = bar.args[0].type
    expect(argType.toString()).toEqual('[String!]!')
    expect(getNamedType(argType)).toEqual(GraphQLString)
  })

  it('Supports nested list argument type', () => {
    @InputObjectType()
    class MySecondInput {
      c = 1
      @InputField()
      bar: string
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(@Arg({ type: [MySecondInput] }) input: MySecondInput[]): string {
        return 'ok'
      }

      @Field()
      foo(input: MySecondInput[]): string {
        return input.length.toString()
      }
    }
    const { bar, foo } = compileObjectType(Foo).getFields()
    const fooArgType = foo.args[0].type
    const argType = bar.args[0].type

    expect(argType.toString()).toEqual('[MySecondInput!]!')
    expect(getNamedType(argType)).toEqual(compileInputObjectType(MySecondInput))

    expect(fooArgType.toString()).toEqual('[MySecondInput!]!')
    expect(getNamedType(fooArgType)).toEqual(
      compileInputObjectType(MySecondInput)
    )
  })
})
