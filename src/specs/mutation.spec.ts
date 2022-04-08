import { graphql } from 'graphql'
import {
  InputObjectType,
  InputField,
  ObjectType,
  Field,
  SchemaRoot,
  Mutation,
  compileSchema,
  Query
} from '../index'

@InputObjectType()
class BarType {
  @InputField()
  value: string
}

@ObjectType()
class Hello {
  constructor(private helloLabel = 'Hello') {}
  @Field()
  world(name: string): string {
    return `${this.helloLabel}, ${name}`
  }
}

@SchemaRoot()
class FooSchema {
  @Mutation()
  hello(): Hello {
    return new Hello()
  }

  @Query()
  deepInput(input: BarType): Hello {
    return new Hello(input.value)
  }
}

const schema = compileSchema(FooSchema)

describe('Mutation', () => {
  it('should not allow wrong argument types', async () => {
    const result = await graphql({
      schema,
      source: `
        mutation {
          hello {
            world(name: 2)
          }
        }
      `
    })
    expect(result.errors).toBeDefined()
    expect(result.errors).toMatchSnapshot()
  })

  it('should allow complex input types', async () => {
    const result = await graphql({
      schema,
      source: `
        {
          deepInput(input: { value: "Hola" }) {
            world(name: "Bob")
          }
        }
      `
    })
    console.error(result.errors)
    expect(result).toEqual({ data: { deepInput: { world: 'Hola, Bob' } } })
  })
})
