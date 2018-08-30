import {
  Query,
  SchemaRoot,
  compileSchema,
  ObjectType,
  Arg,
  Field,
} from '~/domains';
import { graphql } from 'graphql';

@ObjectType()
class Hello {
  @Field()
  boolTest(v1: boolean): boolean {
    return v1;
  }
  @Field()
  boolTest2(@Arg({ isNullable: true }) v2: boolean): boolean {
    return v2;
  }
  @Field()
  boolTest3(v3: boolean): boolean {
    return v3;
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello();
  }
}

const schema = compileSchema({ roots: [FooSchema] });

describe('Query args', () => {
  it('will have correct values even for "false"', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            boolTest(v1: false)
            boolTest2(v2: false)
            boolTest3(v3: true)
          }
        }
      `,
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.hello).toMatchSnapshot();
  });
});
