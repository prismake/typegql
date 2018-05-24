import { GraphQLFloat } from 'graphql';
import { ObjectType, Field, compileObjectType } from '~/domains';

describe('Fields based on getters', () => {
  it('Will work with getter field', async () => {
    let foo: Foo;
    @ObjectType({ description: 'Simple product object type' })
    class Foo {
      a: number;
      @Field()
      get bar(): number {
        if (this !== foo) {
          throw new Error(
            'getter must be resolved with an instance as a context ',
          );
        }
        return this.a + 21;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    foo = new Foo();
    foo.a = 21;
    const resolvedValue = await bar.resolve(foo, null, null, null);
    expect(resolvedValue).toEqual(42);
    expect(bar.type).toEqual(GraphQLFloat);
  });
});
