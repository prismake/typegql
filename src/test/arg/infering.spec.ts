import { GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { Field, ObjectType, compileObjectType } from '~/domains';

describe('Arguments', () => {
  it('Infers basic arguments without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string): string {
        return baz;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();

    expect(bar.args.length).toBeGreaterThan(0);
    const [bazArg] = bar.args;
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString));
    expect(bazArg.name).toBe('baz');
  });

  it('Throws if is not able to infer arguemtn type without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: any): string {
        return baz;
      }
    }
    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Infers multiple basic arguments without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string, boo: number): string {
        return baz;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();

    expect(bar.args.length).toEqual(2);
    const [bazArg, booArg] = bar.args;
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString));
    expect(bazArg.name).toEqual('baz');
    expect(booArg.name).toEqual('boo');
    expect(booArg.type).toEqual(new GraphQLNonNull(GraphQLFloat));
  });
});
