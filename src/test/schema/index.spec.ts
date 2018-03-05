import {
  Query,
  Schema,
  compileSchema,
  ObjectType,
  Field,
  InputField,
  InputObjectType,
} from 'domains';
import { graphql, introspectionQuery } from 'graphql';

describe('@Schema', () => {
  it('should not allow compiling schema not decorated with @Schema', () => {
    class Foo {}

    expect(() => compileSchema(Foo)).toThrowErrorMatchingSnapshot();
  });

  it('should not allow @Schema without any @Query field', () => {
    @Schema()
    class Foo {}

    expect(() => compileSchema(Foo)).toThrowErrorMatchingSnapshot();
  });

  it('should generate all schema fields properly for valid schema', async () => {
    @ObjectType()
    class Hello {
      @Field()
      world(name: string): string {
        return `Hello, ${name}`;
      }
    }

    @Schema()
    class FooSchema {
      @Query()
      hello(): Hello {
        return new Hello();
      }
    }

    const schema = compileSchema(FooSchema);

    expect(await graphql(schema, introspectionQuery)).toMatchSnapshot();
  });
});
