import { graphql } from 'graphql'
import {
  ObjectType,
  Field,
  Arg,
  SchemaRoot,
  Query,
  compileSchema,
  Context
} from '../index'

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

describe('Field args', () => {
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
})