import {
  Arg,
  compileSchema,
  Context,
  Field,
  ObjectType,
  Query,
  SchemaRoot
} from '../../src/index'

import { printSchema } from 'graphql'

describe('arguments', () => {
  it('should compile args correctly', () => {
    @ObjectType()
    class Hello {
      @Field()
      argRename(@Arg({ name: 'myFancyArgument' }) a: string): boolean {
        expect(a).toBe('fancy')

        // @ts-expect-error 3/21/2022
        return null
      }

      @Field()
      argRename2(
        @Arg({ name: 'myFirstFancyArgument' }) a: string,
        @Arg({ name: 'mySecondFancyArgument' }) b: string | null,
        @Context ctx: any
      ): boolean {
        expect(ctx).toBe(null)
        expect(a).toBe('fancya')
        expect(b).toBe('fancyb')

        return false
      }
    }
    @SchemaRoot()
    class BarSchema {
      @Query()
      hello(): Hello {
        return new Hello()
      }
    }

    const schema = compileSchema(BarSchema)

    expect(printSchema(schema)).toMatchSnapshot()
  })
})


describe('onlyDecoratedArgs', function () {
    it.only('should omit args when onlyDecoratedArgs is used', async () => {
      class CustomClass {}
  
      @ObjectType()
      class Test {
        @Field({ onlyDecoratedArgs: true })
        shouldHaveNone(a1?: Function, a2?: CustomClass): boolean {
          return false
        }
  
        @Field({ onlyDecoratedArgs: true })
        shouldHaveOnlyOne(v1: boolean, @Arg() v2: boolean): boolean {
          return v2
        }
      }
  
      @SchemaRoot()
      class FooSchema {
        @Query()
        test(): Test {
          return new Test()
        }
      }
  
      const schema = compileSchema(FooSchema)
      expect(printSchema(schema)).toMatchSnapshot()
  })
  