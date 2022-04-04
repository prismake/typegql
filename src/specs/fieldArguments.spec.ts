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
    @Field()
    boolTest2(@Arg() v2: boolean, @Arg() v2a: boolean): Array<boolean | null> {
      // console.log('[v2, v2a]: ', [v2, v2a]);
      expect(v2).toBe(false)
      expect(v2a).toBe(false)
      // @ts-expect-error 3/21/2022
      return null
    }
    @Field()
    boolTest3(v3: boolean): boolean {
      return v3
    }

    @Field()
    boolTest4(a1: boolean | null, a2: boolean | null): boolean {
      expect(a1).toBeUndefined()
      expect(a2).toBe(true)
      return true
    }

    @Field()
    argRename(
      @Arg({ name: 'myFancyArgument' }) a: string,
      @Context ctx: any
    ): boolean {
      expect(ctx).toBe(null)
      expect(a).toBe('fancy')

      return true
    }

    @Field()
    argRename2(
      @Arg({ name: 'myFirstFancyArgument' }) a: string,
      @Arg({ name: 'mySecondFancyArgument' }) b: string,
      @Context ctx: any
    ): boolean {
      expect(ctx).toBe(null)
      expect(a).toBe('fancya')
      expect(b).toBe('fancyb')

      return false
    }

    @Field()
    defaultVal(@Arg() v3: number | null = 3): number {
      return v3!
    }
  }

  @SchemaRoot()
  class FooSchema {
    @Query()
    hello(): Hello {
      return new Hello()
    }
  }

  it('should compile args correctly', () => {
    @SchemaRoot()
    class BarSchema {
      @Query()
      boolTest4(a1: boolean | null, a2: boolean | null): boolean {
        return false
      }
    }

    const schema = compileSchema(BarSchema)
    console.log(printSchema(schema))
    expect(printSchema(schema)).toEqual(`type Query {
  boolTest4(a1: Boolean, a2: Boolean): Boolean!
}`)
  })

  const schema = compileSchema(FooSchema)

  it('will have correct values even for "false"', async () => {
    const result = await graphql({
      schema,
      source: `
        {
          hello {
            boolTest(v1: false)
            boolTest2(v2: false, v2a: false)
            boolTest3(v3: true)
          }
        }
      `
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.hello).toMatchInlineSnapshot(`
                              Object {
                                "boolTest": false,
                                "boolTest2": null,
                                "boolTest3": true,
                              }
                    `)
  })

  it('will have undefined for args which were not sent down the wire', async () => {
    const result = await graphql({
      schema,
      source: `
        {
          hello {
            boolTest4(a2: true)
          }
        }
      `
    })

    expect(result).toMatchInlineSnapshot(`
                              Object {
                                "data": Object {
                                  "hello": Object {
                                    "boolTest4": true,
                                  },
                                },
                              }
                    `)
  })

  it('will rename argument', async () => {
    const result = await graphql({
      schema,
      source: `
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
    })
    expect(result).toMatchInlineSnapshot(`
                              Object {
                                "data": Object {
                                  "hello": Object {
                                    "argRename": true,
                                    "argRename2": false,
                                  },
                                },
                              }
                    `)
  })

  it('uses the default value', async () => {
    const result = await graphql({
      schema,
      source: `
        {
          hello {
            defaultVal
          }
        }
      `
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.hello).toMatchInlineSnapshot(`
      Object {
        "defaultVal": 3,
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
        a1: any
      ): String {
        return 'a'
      }
    }

    const schema = compileSchema(FooSchema)
    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "type Query {
        hello(a1: MyInputObject): String!
      }

      input MyInputObject {
        a: String!
      }"
    `)
  })
})
