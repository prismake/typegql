import { GraphQLNonNull, getNamedType, GraphQLString } from 'graphql';
import {
  Field,
  ObjectType,
  compileObjectType,
  compileInputObjectType,
  InputField,
  InputObjectType,
  Arg,
} from '~/domains';

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

  it('Supports scalar list argument type', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ type: [String] })
        input: string[],
      ): string {
        return 'ok';
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    const argType = bar.args[0].type;
    expect(argType.toString()).toEqual('[String!]!');
    expect(getNamedType(argType)).toEqual(GraphQLString);
  });

  it('Supports nested list argument type', () => {
    @InputObjectType()
    class Input {
      @InputField() bar: string;
    }

    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ type: [Input] })
        input: Input[],
      ): string {
        return 'ok';
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    const argType = bar.args[0].type;
    expect(argType.toString()).toEqual('[Input!]!');
    expect(getNamedType(argType)).toEqual(compileInputObjectType(Input));
  });
});
