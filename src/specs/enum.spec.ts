import { graphql, printSchema } from 'graphql'
import {
  registerEnum,
  ObjectType,
  Field,
  Arg,
  SchemaRoot,
  Query,
  compileSchema
} from '../index'

export enum TestEnum {
  Foo = 'Foo',
  Bar = 'Bar',
  Baz = 'Baz'
}

registerEnum(TestEnum, { name: 'TestEnum' })

enum AdvancedEnum {
  DescriptionProperty = 'DescriptionProperty',
  DeprecationProperty = 'DeprecationProperty'
}
registerEnum(AdvancedEnum, {
  name: 'AdvancedEnum',
  fieldsConfig: {
    DescriptionProperty: { description: 'One field description' },
    DeprecationProperty: { deprecationReason: 'Two field deprecation reason' }
  }
})

@ObjectType()
class Hello {
  @Field()
  world(@Arg({ type: TestEnum }) name: TestEnum): string {
    return `Hello, ${name}`
  }
  @Field({ type: AdvancedEnum })
  getAdvancedEnumValue(): AdvancedEnum {
    return AdvancedEnum.DescriptionProperty
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

describe('Query with enums', () => {
  it('picks up description and deprecation', async () => {
    expect(printSchema(schema)).toMatchSnapshot()
  })

  it('Will guard proper enum values', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            world(name: Foob)
          }
        }
      `
    )

    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchInlineSnapshot(`
      Array [
        [GraphQLError: Value "Foob" does not exist in "TestEnum" enum. Did you mean the enum value "Foo"?],
      ]
    `)
  })
})
