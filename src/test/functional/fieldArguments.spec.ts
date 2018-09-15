import { graphql } from 'graphql'
import { ObjectType, Field, Arg, SchemaRoot, Query, compileSchema } from '../..'

@ObjectType()
class Hello {
  @Field()
  boolTest(v1: boolean): boolean {
    return v1
  }
  @Field({ type: [Boolean], isNullable: true })
  boolTest2(
    @Arg({ isNullable: true }) v2: boolean,
    @Arg({ isNullable: true }) v2a: boolean,
  ): boolean[] {
    // console.log('[v2, v2a]: ', [v2, v2a]);
    return [v2, v2a]
  }
  @Field()
  boolTest3(v3: boolean): boolean {
    return v3
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }
}

const schema = compileSchema({ roots: [FooSchema] })

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
      `,
    )

    expect(result.errors).toBeUndefined()
    expect(result.data.hello).toMatchSnapshot()
  })

  it.skip('will have undefined for args which were not sent down the wire', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            boolTest2(v2a: true)
          }
        }
      `,
    )
    console.log('result: ', result)
  })
})
