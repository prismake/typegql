import { graphql, printSchema } from 'graphql'
import {
  ObjectType,
  Field,
  Arg,
  SchemaRoot,
  Query,
  compileSchema,
  Context,
  InputField
} from '../index'
import { InputObjectType } from '../../src/domains/inputObjectType/InputObjectType'

describe('Field args', () => {
  @ObjectType()
  class Hello {
    @Field()
    boolTest(v1: boolean): boolean {
      return v1
    }
    @Field({ type: [Boolean], isNullable: true })
    boolTest2(
      @Arg() v2: boolean,
      @Arg({ isNullable: true }) v2a: boolean
    ): boolean[] {
      // console.log('[v2, v2a]: ', [v2, v2a]);
      expect(v2).toBe(false)
      expect(v2a).toBe(false)
      return null
    }
    @Field()
    boolTest3(v3: boolean): boolean {
      return v3
    }

    @Field()
    boolTest4(@Arg({ isNullable: true }) a1: boolean, a2: boolean): boolean {
      expect(a1).toBeUndefined()
      expect(a2).toBe(true)
      return null
    }

    @Field()
    argRename(
      @Context ctx: any,
      @Arg({ isNullable: true, name: 'myFancyArgument' }) a: string
    ): boolean {
      expect(ctx).toBe(null)
      expect(a).toBe('fancy')

      return null
    }

    @Field()
    argRename2(
      @Arg({ isNullable: true, name: 'myFirstFancyArgument' }) a: string,
      @Arg({ isNullable: true, name: 'mySecondFancyArgument' }) b: string,
      @Context ctx: any
    ): boolean {
      expect(ctx).toBe(null)
      expect(a).toBe('fancya')
      expect(b).toBe('fancyb')

      return null
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

  it('will have correct values even for "false"', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            boolTest(v1: false)
            boolTest2(v2: false, v2a: false)
            boolTest3(v3: true)
          }
        }
      `
    )

    expect(result.errors).toBeUndefined()
    expect(result.data.hello).toMatchInlineSnapshot(`
                              Object {
                                "boolTest": false,
                                "boolTest2": null,
                                "boolTest3": true,
                              }
                    `)
  })

  it('will have undefined for args which were not sent down the wire', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            boolTest4(a2: true)
          }
        }
      `
    )
    expect(result).toMatchInlineSnapshot(`
                              Object {
                                "data": Object {
                                  "hello": Object {
                                    "boolTest4": null,
                                  },
                                },
                              }
                    `)
  })

  it('will rename argument', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            argRename(myFancyArgument: "fancy")
            argRename2(
              mySecondFancyArgument: "fancyb"
              myFirstFancyArgument: "fancya"
            )
          }
        }
      `
    )
    expect(result).toMatchInlineSnapshot(`
                              Object {
                                "data": Object {
                                  "hello": Object {
                                    "argRename": null,
                                    "argRename2": null,
                                  },
                                },
                              }
                    `)
  })

  it('allows to return type of argument that is created dynamically', async () => {
    @SchemaRoot()
    class FooSchema {
      @Query()
      hello(
        @Arg({
          type: () => {
            @InputObjectType()
            class MyInputObject {
              @InputField()
              a: string
            }

            return MyInputObject
          }
        })
        a1: string
      ): String {
        return 'a'
      }
    }

    const schema = compileSchema(FooSchema)
    expect(printSchema(schema)).toMatchInlineSnapshot(`
                        "input MyInputObject {
                          a: String!
                        }

                        type Query {
                          hello(a1: MyInputObject!): String
                        }
                        "
                `)
  })
})

describe('onlyDecoratedArgs', function() {
  it('should omit args when onlyDecoratedArgs is used', async () => {
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
    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "type Query {
        test: Test
      }

      type Test {
        shouldHaveNone: Boolean
        shouldHaveOnlyOne(v2: Boolean!): Boolean
      }
      "
    `)
  })
})
