import { GraphQLString, GraphQLFloat } from 'graphql';
import { Field, Type, compileType } from 'domains';

describe('Arguments', () => {
  it('Infers basic arguments without @Arg decorator', () => {
    @Type()
    class Foo {
      @Field()
      bar(baz: string): string {
        return baz;
      }
    }
    const { bar } = compileType(Foo).getFields();

    expect(bar.args.length).toBeGreaterThan(0);
    const [bazArg] = bar.args;
    expect(bazArg.type).toBe(GraphQLString);
    expect(bazArg.name).toBe('baz');
  });

  it('Throws if is not able to infer arguemtn type without @Arg decorator', () => {
    @Type()
    class Foo {
      @Field()
      bar(baz: any): string {
        return baz;
      }
    }
    expect(() => compileType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Infers multiple basic arguments without @Arg decorator', () => {
    @Type()
    class Foo {
      @Field()
      bar(baz: string, boo: number): string {
        return baz;
      }
    }
    const { bar } = compileType(Foo).getFields();

    expect(bar.args.length).toEqual(2);
    const [bazArg, booArg] = bar.args;
    expect(bazArg.type).toBe(GraphQLString);
    expect(bazArg.name).toBe('baz');
    expect(booArg.name).toBe('boo');
    expect(booArg.type).toBe(GraphQLFloat);
  });
});
