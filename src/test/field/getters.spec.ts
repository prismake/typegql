import { GraphQLFloat } from 'graphql';
import { ObjectType, Field, compileObjectType } from '~/domains';

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
});
