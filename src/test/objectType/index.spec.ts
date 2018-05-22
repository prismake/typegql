import { GraphQLObjectType } from 'graphql';
import { ObjectType, compileObjectType } from '~/domains';
import { Field } from '~/domains/field';

describe('Type', () => {
  it('Throws when trying to compile type without @ObjectType decorator', () => {
    expect(() => compileObjectType(class Bar {})).toThrowErrorMatchingSnapshot();
  });

  it('Throws when @ObjectType has no fields', () => {
    @ObjectType()
    class NoFields {}

    @ObjectType()
    class NoDeclaredFields {
      foo: string;
    }
    expect(() => compileObjectType(NoFields)).toThrowErrorMatchingSnapshot();
    expect(() => compileObjectType(NoDeclaredFields)).toThrowErrorMatchingSnapshot();
  });

  it('Compiles basic type with field', () => {
    @ObjectType()
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileObjectType(Foo);

    const fields = compiled.getFields();
    const barField = fields.bar;

    expect(compiled).toBeInstanceOf(GraphQLObjectType);

    expect(barField).toBeTruthy();
    expect(barField.name).toEqual('bar');
  });

  it('Sets proper options', () => {
    @ObjectType({ description: 'Baz' })
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileObjectType(Foo);

    expect(compiled.description).toEqual('Baz');
    expect(compiled.name).toEqual('Foo');

    @ObjectType({ name: 'Baz' })
    class FooCustomName {
      @Field() bar: string;
    }

    const compiledCustomName = compileObjectType(FooCustomName);

    expect(compiledCustomName.name).toEqual('Baz');
  });

  it('Final type is compiled only once per class', () => {
    @ObjectType()
    class Foo {
      @Field() bar: string;
    }

    const compiledA = compileObjectType(Foo);
    const compiledB = compileObjectType(Foo);

    expect(compiledA).toBe(compiledB);
  });
});
