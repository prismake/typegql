import { Query, SchemaRoot, compileSchema, ObjectType, Field } from '~/domains';
import { graphql } from 'graphql';

@ObjectType()
class Hello {
  @Field()
  world(name: string): string {
    return `Hello, ${name}`;
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello();
  }

  @Query()
  foo(): string {
    return 'bar';
  }
}

const schema = compileSchema({ roots: [FooSchema] });

describe('Query', () => {
  it('should support queries with simple arguments', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            world(name: "Bob")
          }
        }
      `,
    );

    expect(result).toEqual({ data: { hello: { world: 'Hello, Bob' } } });
  });

  it('should not allow wrong argument types', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            world(name: 2)
          }
        }
      `,
    );
    expect(result.errors).toBeDefined();
    expect(result.errors).toMatchSnapshot();
  });

  it('will support flat root fields', async () => {
    const result = await graphql(
      schema,
      `
        {
          foo
        }
      `,
    );
    expect(result).toEqual({ data: { foo: 'bar' } });
  });
});
