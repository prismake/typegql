import { GraphQLString, GraphQLNonNull } from 'graphql';
import { InputObjectType, InputField, compileInputObjectType } from '~/domains';

describe('Type inheritance', () => {
  it('Will pass input fields from parent class', () => {
    class Base {
      @InputField() baseField: string;
    }

    @InputObjectType()
    class Foo extends Base {}

    const { baseField } = compileInputObjectType(Foo).getFields();

    expect(baseField.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('Will overwrite input fields in child class', () => {
    class Base {
      @InputField() foo: string;
      @InputField() bar: string;
    }

    @InputObjectType()
    class Foo extends Base {
      @InputField({ isNullable: true })
      foo: string;
    }

    const { foo, bar } = compileInputObjectType(Foo).getFields();

    expect(bar.type).toEqual(new GraphQLNonNull(GraphQLString));
    expect(foo.type).toEqual(GraphQLString);
  });
});
