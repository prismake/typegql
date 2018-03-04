import { GraphQLUnionType } from 'graphql';
import { ObjectType, Union, Field, compileObjectType } from 'domains';
import { resolveType } from 'services/utils';

@ObjectType()
class Sub1 {
  @Field() bar: string;
}

@ObjectType()
class Sub2 {
  @Field() bar: number;
}

@Union({ types: [Sub1, Sub2] })
class UnionType {}

@ObjectType()
class Foo {
  @Field({ type: UnionType })
  bar: Sub1 | Sub2;
}

describe('Unions', () => {
  it('Registers returns proper enum type', () => {
    const { bar } = compileObjectType(Foo).getFields();
    expect(bar.type).toEqual(resolveType(UnionType));
    expect(bar.type).not.toEqual(UnionType);
  });

  it('Properly resolves type of union', () => {
    const { bar } = compileObjectType(Foo).getFields();

    const unionType = bar.type as GraphQLUnionType;

    expect(unionType.resolveType(new Sub1(), null, null)).toBe(resolveType(Sub1));
    expect(unionType.resolveType(new Sub2(), null, null)).toBe(resolveType(Sub2));
  });
});
