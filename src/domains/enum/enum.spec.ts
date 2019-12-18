import { resolveType } from '../../services/utils/gql/types/typeResolvers'
import { registerEnum } from '../..'
import { SchemaRoot, compileSchema } from '../schema/SchemaRoot'
import { Query } from '../schema/rootFields'
import { printSchema, graphql } from 'graphql'
import { Arg } from '../arg/ArgDecorators'

describe('Enums', () => {
  it('throws when the enum key cannot be used with GQL', () => {
    enum Foo {
      Bar = 'Test-this will totally fail',
      Baz = 'Test2'
    }

    enum Foo2 {
      'Bar-a' = 0,
      Baz = 1
    }
    try {
      registerEnum(Foo, 'Foo')
    } catch (err) {
      expect(err).toMatchInlineSnapshot(
        `[Error: enum key "Test-this will totally fail" cannot be exposed on graphql]`
      )
    }
    try {
      registerEnum(Foo2, 'Foo2')
    } catch (err) {
      expect(err).toMatchInlineSnapshot(
        `[Error: enum key "Bar-a" cannot be exposed on graphql]`
      )
    }
  })

  it('Registers returns proper enum type', () => {
    enum Foo {
      'Bar',
      'Baz'
    }

    const enumType = registerEnum(Foo, 'Foo')
    expect(enumType.name).toEqual('Foo')
    expect(enumType.getValues().length).toEqual(2)
    expect(enumType.getValues()[0].name).toEqual('Bar')
    expect(enumType.getValues()[0].value).toEqual(0)
  })

  it('Registers returns proper enum type with string based enums', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2'
    }

    const enumType = registerEnum(Foo, 'Foo')
    expect(enumType.name).toEqual('Foo')
    expect(enumType.getValues().length).toEqual(2)
    expect(enumType.getValues()[1].name).toEqual('Test2')
    expect(enumType.getValues()[1].value).toEqual('Test2')
  })

  it('Throw when registering the same enum twice', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2'
    }

    registerEnum(Foo, { name: 'Foo' })
    expect(() =>
      registerEnum(Foo, { name: 'Foo2' })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Enum Foo2: Enum is already registered"`
    )
  })

  it('Will properly resolve registered enum', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2'
    }

    const enumType = registerEnum(Foo, { name: 'Foo' })
    expect(resolveType(Foo)).toEqual(enumType)
  })

  it('renders schema with an enum used in a query', async () => {
    enum IntEnum {
      one,
      two
    }

    enum StateEnum {
      Done = 'DONE',
      In_Progress = 'IN_PROGRESS',
      Finished = 'FINISHED',
      Cancelled = 'CANCELLED'
    }

    enum StateEnumUsingKeys {
      Done = 'DONE',
      InProgress = 'INPROGRESS',
      Finished = 'FINISHED',
      Cancelled = 'CANCELLED'
    }

    registerEnum(StateEnum, { name: 'StateEnum' })
    registerEnum(StateEnumUsingKeys, {
      name: 'StateEnumUsingKeys',
      useKeys: true // this is not a good practice as you have inconsistent values for enums on FE and BE if you use keys, but it is necessary in some cases
    })

    registerEnum(IntEnum, { name: 'IntEnum' })
    @SchemaRoot()
    class FooSchema {
      @Query()
      echoAsInferred(@Arg({ type: StateEnum }) input: StateEnum): StateEnum {
        return input
      }
      @Query({ type: StateEnum })
      echoAsEnum(@Arg({ type: StateEnum }) input: StateEnum): StateEnum {
        return input
      }

      @Query({ type: StateEnumUsingKeys })
      echoAsEnum2(
        @Arg({ type: StateEnumUsingKeys }) input: StateEnumUsingKeys
      ): StateEnumUsingKeys {
        expect(input).toBe('FINISHED')
        return input
      }

      @Query()
      intAsInferred(@Arg({ type: IntEnum }) input: IntEnum): IntEnum {
        return input
      }

      @Query({ type: IntEnum })
      intAsEnum(@Arg({ type: IntEnum }) input: IntEnum): IntEnum {
        return input
      }
    }
    const schema = compileSchema(FooSchema)
    expect(printSchema(schema)).toMatchSnapshot()
    const result = await graphql(
      schema,
      `
        {
          echoAsInferred(input: IN_PROGRESS)
          echoAsEnum(input: IN_PROGRESS)
          echoAsEnum2(input: Finished)
          intAsEnum(input: two)
          intAsInferred(input: two)
        }
      `
    )

    expect(result).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "echoAsEnum": "IN_PROGRESS",
          "echoAsEnum2": "Finished",
          "echoAsInferred": "IN_PROGRESS",
          "intAsEnum": "two",
          "intAsInferred": 1,
        },
      }
    `)
  })
})
