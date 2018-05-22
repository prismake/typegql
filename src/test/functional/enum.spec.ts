import {
  Query,
  SchemaRoot,
  compileSchema,
  ObjectType,
  Arg,
  Field,
  registerEnum,
} from '~/domains';
import { graphql } from 'graphql';

enum TestEnum {
  Foo = 'Foo',
  Bar = 'Bar',
  Baz = 'Baz',
}

registerEnum(TestEnum, { name: 'TestEnum' });

@ObjectType()
class Hello {
  @Field()
  world(
    @Arg({ type: TestEnum })
    name: TestEnum,
  ): string {
    return `Hello, ${name}`;
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello();
  }
}

const schema = compileSchema({ roots: [FooSchema] });

describe('Query with enums', () => {
  it('Will guard proper enum values', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            world(name: Foob)
          }
        }
      `,
    );

    expect(result.errors).toBeDefined();
    expect(result.errors).toMatchSnapshot();
  });
});
