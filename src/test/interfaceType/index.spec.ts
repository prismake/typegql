import { GraphQLInterfaceType } from 'graphql';
import { InterfaceType, compileInterfaceType } from '~/domains';
import { Field } from '~/domains/field';

describe('Type', () => {
  it('Throws when trying to compile type without @InterfaceType decorator', () => {
    expect(() =>
      compileInterfaceType(class Bar {}),
    ).toThrowErrorMatchingSnapshot();
  });

  it('Throws when @InterfaceType has no fields', () => {
    @InterfaceType()
    class NoFields {}

    @InterfaceType()
    class NoDeclaredFields {
      foo: string;
    }
    expect(() => compileInterfaceType(NoFields)).toThrowErrorMatchingSnapshot();
    expect(() =>
      compileInterfaceType(NoDeclaredFields),
    ).toThrowErrorMatchingSnapshot();
  });

  it('Compiles basic type with field', () => {
    @InterfaceType()
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileInterfaceType(Foo);

    const fields = compiled.getFields();
    const barField = fields.bar;

    expect(compiled).toBeInstanceOf(GraphQLInterfaceType);

    expect(barField).toBeTruthy();
    expect(barField.name).toEqual('bar');
  });

  it('Sets proper options', () => {
    @InterfaceType({ description: 'Baz' })
    class Foo {
      @Field() bar: string;
    }

    const compiled = compileInterfaceType(Foo);

    expect(compiled.description).toEqual('Baz');
    expect(compiled.name).toEqual('Foo');

    @InterfaceType({ name: 'Baz' })
    class FooCustomName {
      @Field() bar: string;
    }

    const compiledCustomName = compileInterfaceType(FooCustomName);

    expect(compiledCustomName.name).toEqual('Baz');
  });

  it('Final type is compiled only once per class', () => {
    @InterfaceType()
    class Foo {
      @Field() bar: string;
    }

    const compiledA = compileInterfaceType(Foo);
    const compiledB = compileInterfaceType(Foo);

    expect(compiledA).toBe(compiledB);
  });
});
