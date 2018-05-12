import { GraphQLString, GraphQLNonNull } from 'graphql';
import { ObjectType, compileObjectType, Field } from '~/domains';

describe('Type inheritance', () => {
  it('Will pass fields from parent class', () => {
    class Base {
      @Field() baseField: string;
    }

    @ObjectType()
    class Foo extends Base {}

    const { baseField } = compileObjectType(Foo).getFields();

    expect(baseField.type).toEqual(GraphQLString);
  });

  it('Will overwrite fields in child class', () => {
    class Base {
      @Field() foo: string;
      @Field() bar: string;
    }

    @ObjectType()
    class Foo extends Base {
      @Field({ isNullable: false })
      foo: string;
    }

    const { foo, bar } = compileObjectType(Foo).getFields();

    expect(bar.type).toEqual(GraphQLString);
    expect(foo.type).toEqual(new GraphQLNonNull(GraphQLString));
  });
});
