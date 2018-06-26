import { GraphQLObjectType } from 'graphql';
import { ObjectType, compileObjectType, Field } from '~/domains';

describe('ObjectType - input', () => {
  it('Should convert simple object type to input object type', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar: string;
    }

    @ObjectType()
    class Bar {
      @Field()
      baz(foo: Foo) {
        return foo.bar;
      }
    }

    compileObjectType(Bar).getFields();
  });
});
