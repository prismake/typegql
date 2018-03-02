import { GraphQLString, GraphQLNonNull } from 'graphql';
import {
  Field,
  ObjectType,
  compileObjectType,
  compileInputObjectType,
  Arg,
  InputField,
  InputObjectType,
} from 'domains';

describe('Complex arguments', () => {
  it('should not allow complex argument type not decorated with @InputObjectType', async () => {
    class Input {
      @InputField() bar: string;
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(input: Input): string {
        return 'ok';
      }
    }
    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('should not allow complex argument type decorated with @ObjectType', async () => {
    @ObjectType()
    class Input {
      @Field() bar: string;
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(input: Input): string {
        return 'ok';
      }
    }

    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });
  it('Supports complex input types', async () => {
    @InputObjectType()
    class Input {
      @InputField() bar: string;
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(input: Input): string {
        return 'ok';
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    expect(bar.args[0].type).toEqual(new GraphQLNonNull(compileInputObjectType(Input)));
  });
});
