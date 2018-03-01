import { Query, Schema, compileSchema, ObjectType, Field } from 'domains';
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

    expect(() => compileSchema(Foo)).toThrow();
  });

  it('should properly register and resolve schema with query field of type GraphQLObjectType', async () => {
    @ObjectType()
    class PlainType {
      @Field() field: string = 'test';
    }

    @Schema()
    class FooSchema {
      @Query()
      bar(): PlainType {
        return new PlainType();
      }
    }

    const schema = compileSchema(FooSchema);
    const result = await graphql(
      schema,
      `
        {
          bar {
            field
          }
        }
      `,
    );

    expect(result).toEqual({ data: { bar: { field: 'test' } } });
  });
});
