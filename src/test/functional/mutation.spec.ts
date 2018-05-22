import {
  Query,
  SchemaRoot,
  compileSchema,
  ObjectType,
  Field,
  Mutation,
  InputField,
  InputObjectType,
} from '~/domains';
import { graphql } from 'graphql';

@InputObjectType()
class Input {
  @InputField() value: string;
}

@ObjectType()
class Hello {
  constructor(private helloLabel = 'Hello') {}
  @Field()
  world(name: string): string {
    return `${this.helloLabel}, ${name}`;
  }
}

@SchemaRoot()
class FooSchema {
  @Mutation()
  hello(): Hello {
    return new Hello();
  }

  @Query()
  deepInput(input: Input): Hello {
    return new Hello(input.value);
  }
}

const schema = compileSchema({ roots: [FooSchema] });

describe('Mutation', () => {
  it('should not allow wrong argument types', async () => {
    const result = await graphql(
      schema,
      `
        mutation {
          hello {
            world(name: 2)
          }
        }
      `,
    );
    expect(result.errors).toBeDefined();
    expect(result.errors).toMatchSnapshot();
  });

  it('should allow complex input types', async () => {
    const result = await graphql(
      schema,
      `
        {
          deepInput(input: { value: "Hola" }) {
            world(name: "Bob")
          }
        }
      `,
    );

    expect(result).toEqual({ data: { deepInput: { world: 'Hola, Bob' } } });
  });
});
