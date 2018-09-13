import { GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { ObjectType, Field, compileObjectType } from '../..';
import { GraphQLDateTime } from 'graphql-iso-date';

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
    expect(() =>
      compileObjectType(Foo).getFields(),
    ).toThrowErrorMatchingSnapshot();
  });

  it('Infers multiple basic arguments without @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string, boo: number): string {
        return baz;
      }
      @Field()
      dateField(date: Date): Date {
        return date;
      }
    }
    const { bar, dateField } = compileObjectType(Foo).getFields();

    expect(bar.args.length).toEqual(2);
    const [bazArg, booArg] = bar.args;
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString));
    expect(bazArg.name).toEqual('baz');
    expect(booArg.name).toEqual('boo');
    expect(booArg.type).toEqual(new GraphQLNonNull(GraphQLFloat));

    expect(dateField.args.length).toEqual(1);
    const [date] = dateField.args;

    expect(date.type).toEqual(new GraphQLNonNull(GraphQLDateTime));
    expect(date.name).toEqual('date');
  });
});
