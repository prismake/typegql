import {
  Query,
  Schema,
  compileSchema,
  ObjectType,
  Field,
  compileObjectType,
} from 'domains';
import { graphql, GraphQLObjectType } from 'graphql';

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

  it('should not allow registering query filed that is not compilable to GraphQLObjectType', () => {
    @Schema()
    class Foo {
      @Query() bar: string;
    }

    expect(() => compileSchema(Foo)).toThrowErrorMatchingSnapshot();
  });

  it('should properly register and resolve schema with query field of type GraphQLObjectType', async () => {
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
});
