import { GraphQLObjectType } from 'graphql';
import { Type, compileType } from 'domains/type';
import { Field } from 'domains/field';

describe('Type', () => {
  it('Throws when trying to compile type without @Type decorator', () => {
    expect(() => compileType(class Bar {})).toThrowErrorMatchingSnapshot();
  });

  it('Throws when @Type has no fields', () => {
    @Type()
    class NoFields {}

    @Type()
    class NoDeclaredFields {
      foo: string;
    }
    expect(() => compileType(NoFields)).toThrowErrorMatchingSnapshot();
    expect(() => compileType(NoDeclaredFields)).toThrowErrorMatchingSnapshot();
  });

  it('Compiles basic type with field', () => {
    @Type()
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileType(Foo);

    const fields = compiled.getFields();
    const barField = fields.bar;

    expect(compiled).toBeInstanceOf(GraphQLObjectType);

    expect(barField).toBeTruthy();
    expect(barField.name).toEqual('bar');
  });

  it('Sets proper options', () => {
    @Type({ description: 'Baz' })
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileType(Foo);

    expect(compiled.description).toEqual('Baz');
    expect(compiled.name).toEqual('Foo');

    @Type({ name: 'Baz' })
    class FooCustomName {
      @Field() bar: string;
    }

    const compiledCustomName = compileType(FooCustomName);

    expect(compiledCustomName.name).toEqual('Baz');
  });

  it('Final type is compiled only once per class', () => {
    @Type()
    class Foo {
      @Field() bar: string;
    }

    const compiledA = compileType(Foo);
    const compiledB = compileType(Foo);

    expect(compiledA).toBe(compiledB);
  });
});
