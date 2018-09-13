import { GraphQLFloat } from 'graphql';
import { ObjectType, Field, compileObjectType } from '../..';

describe('Fields based on getters', () => {
  it('Will work with getter field', async () => {
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      @Field()
      get bar(): number {
        return 42;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    const resolvedValue = await bar.resolve(new Foo(), null, null, null);
    expect(resolvedValue).toEqual(42);
    expect(bar.type).toEqual(GraphQLFloat);
  });

  it('Will not run getter when defining object type', async () => {
    const spy = jest.fn();
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      @Field()
      get bar(): number {
        console.log('spy');
        spy();
        return 42;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    expect(spy).not.toBeCalled();
    expect(bar.type).toEqual(GraphQLFloat);
  });

  it('Will run getter with proper context', async () => {
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      constructor(public number: number) {}

      baz: number = 42;
      @Field()
      get bar(): number {
        return this.number + this.baz;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    const result = await bar.resolve(new Foo(100), null, null, null);

    expect(result).toEqual(142);
  });
});
