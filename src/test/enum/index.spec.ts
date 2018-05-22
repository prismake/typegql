import { registerEnum } from '~/domains';
import { resolveType } from '~/services/utils';

describe('Enums', () => {
  it('Registers returns proper enum type', () => {
    enum Foo {
      Bar,
      Baz,
    }

    const enumType = registerEnum(Foo, 'Foo');
    expect(enumType.name).toEqual('Foo');
    expect(enumType.getValues().length).toEqual(2);
    expect(enumType.getValues()[0].name).toEqual('Bar');
    expect(enumType.getValues()[0].value).toEqual(0);
  });

  it('Registers returns proper enum type with string based enums', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2',
    }

    const enumType = registerEnum(Foo, 'Foo');
    expect(enumType.name).toEqual('Foo');
    expect(enumType.getValues().length).toEqual(2);
    expect(enumType.getValues()[1].name).toEqual('Baz');
    expect(enumType.getValues()[1].value).toEqual('Test2');
  });

  it('Throw when registering the same enum twice', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2',
    }

    registerEnum(Foo, { name: 'Foo' });
    expect(() => registerEnum(Foo, { name: 'Foo2' })).toThrowErrorMatchingSnapshot();
  });

  it('Will properly resolve registered enum', () => {
    enum Foo {
      Bar = 'Test',
      Baz = 'Test2',
    }

    const enumType = registerEnum(Foo, { name: 'Foo' });
    expect(resolveType(Foo)).toEqual(enumType);
  });
});
