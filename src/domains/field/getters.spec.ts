import { GraphQLFloat, GraphQLNonNull } from 'graphql'
import { ObjectType, Field, compileObjectType } from '../..'

describe('Fields based on getters', () => {
  it('should throw when used on getter', () => {
    try {
      @ObjectType({ description: 'Simple product object type' })
      class Foo {
        @Field()
        get bar(): number {
          return 42
        }
      }
    } catch (err) {
      expect(err.toString()).toEqual('Error: Field cannot be on a getter')
    }
  })
})

// TODO unskip when https://github.com/typescript-rtti/typescript-rtti/issues/52 is fixed
describe.skip('Fields based on getters', () => {
  it('Will work with getter field', async () => {
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      @Field()
      get bar(): number {
        return 42
      }
    }

    const { bar } = compileObjectType(Foo).getFields()
    // @ts-expect-error 3/21/2022
    const resolvedValue = await bar.resolve(new Foo(), null, null, null)
    expect(resolvedValue).toEqual(42)
    expect(bar.type).toEqual(new GraphQLNonNull(GraphQLFloat))
  })

  it('Will not run getter when defining object type', async () => {
    const spy = jest.fn()
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      @Field()
      get bar(): number {
        console.log('spy')
        throw new Error('aaa')
        spy()
        return 42
      }
    }

    const { bar } = compileObjectType(Foo).getFields()
    expect(spy).not.toBeCalled()
    expect(bar.type).toEqual(new GraphQLNonNull(GraphQLFloat))
  })

  it('Will run getter with proper context', async () => {
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      constructor(public number: number) {}

      baz: number = 42
      @Field()
      get bar(): number {
        return this.number + this.baz
      }
    }

    const { bar } = compileObjectType(Foo).getFields()
    // @ts-expect-error 3/21/2022
    const result = await bar.resolve(new Foo(100), null, null, null)

    expect(result).toEqual(142)
  })
})
