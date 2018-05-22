import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  isNamedType,
  getNamedType,
} from 'graphql';
import { ObjectType, Field, compileObjectType } from '~/domains';

import 'reflect-metadata';

describe('Field', () => {
  it('Resolves fields with default value', async () => {
    @ObjectType()
    class Foo {
      @Field() bar: string = 'baz';
    }
    const compiled = compileObjectType(Foo);
    const barField = compiled.getFields().bar;

    expect(await barField.resolve(new Foo(), {}, null, null)).toEqual('baz');
  });

  it('Resolves fields with function resolver', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(): string {
        return 'baz';
      }
    }

    const compiled = compileObjectType(Foo);
    const barField = compiled.getFields().bar;

    expect(await barField.resolve(new Foo(), {}, null, null as any)).toEqual('baz');
  });

  it('Handles description', () => {
    @ObjectType()
    class Foo {
      @Field({ description: 'test' })
      bar: string = 'baz';
    }
    expect(compileObjectType(Foo).getFields().bar.description).toEqual('test');
  });

  it('Handles custom name', async () => {
    @ObjectType()
    class Foo {
      @Field({ name: 'baz', description: 'test' })
      bar: string = 'test';
    }
    const compiled = compileObjectType(Foo);
    const bazField = compiled.getFields().baz;
    expect(compiled.getFields().bar).toBeFalsy();
    expect(bazField).toBeTruthy();
    expect(bazField.description).toEqual('test');
    expect(await bazField.resolve(new Foo(), {}, null, null as any)).toBe('test');
  });

  it('Properly infers basic scalar types', () => {
    @ObjectType()
    class Foo {
      @Field() bar: string;
      @Field() baz: number;
      @Field() foo: boolean;
      @Field() coo: boolean = false;
      @Field()
      boo(): boolean {
        return true;
      }
    }

    const { bar, baz, foo, boo, coo } = compileObjectType(Foo).getFields();

    expect(bar.type).toEqual(GraphQLString);
    expect(baz.type).toEqual(GraphQLFloat);
    expect(foo.type).toEqual(GraphQLBoolean);
    expect(boo.type).toEqual(GraphQLBoolean);
    expect(coo.type).toEqual(GraphQLBoolean);
  });

  it('Properly sets forced field type', () => {
    @ObjectType()
    class Foo {
      @Field({ type: () => GraphQLFloat })
      bar: string;
    }

    const { bar } = compileObjectType(Foo).getFields();
    expect(bar.type).toEqual(GraphQLFloat);
  });

  it('Supports references to other types', () => {
    @ObjectType()
    class Foo {
      @Field() foo: string;
    }

    @ObjectType()
    class Bar {
      @Field() foo: Foo;
    }

    const { foo } = compileObjectType(Bar).getFields();
    const compiledFoo = compileObjectType(Foo);
    expect(foo.type).toBe(compiledFoo);
  });

  it('Supports references to itself', () => {
    @ObjectType()
    class Foo {
      @Field() fooNested: Foo;
    }

    const { fooNested } = compileObjectType(Foo).getFields();
    expect(fooNested.type).toBe(compileObjectType(Foo));
  });

  it('Supports circular references', () => {
    @ObjectType()
    class Car {
      @Field({ type: () => Owner })
      owner: Owner;
    }

    @ObjectType()
    class Owner {
      @Field({ type: () => Car })
      car: Car;
    }

    const { owner } = compileObjectType(Car).getFields();
    const { car } = compileObjectType(Owner).getFields();

    expect(owner.type).toBe(compileObjectType(Owner));
    expect(car.type).toBe(compileObjectType(Car));
  });

  it('Throws if pointing to unregistered type', () => {
    class Foo {}

    @ObjectType()
    class Bar {
      @Field({ type: () => Foo })
      foo: Foo;
    }

    expect(() => compileObjectType(Bar).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Properly resolves native scalar types', () => {
    @ObjectType()
    class Foo {
      @Field({ type: () => String })
      bar: any;
      @Field({ type: () => Number })
      baz: any;
    }

    const { bar, baz } = compileObjectType(Foo).getFields();
    expect(bar.type).toBe(GraphQLString);
    expect(baz.type).toBe(GraphQLFloat);
  });

  it('Shows proper error message when trying to use list type without being explicit about item type', () => {
    @ObjectType()
    class Foo {
      @Field() bar: string[];
    }

    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Shows proper error message when trying to use promise type without being explicit about item type', () => {
    @ObjectType()
    class Foo {
      @Field()
      async bar() {
        return 'baz';
      }
    }

    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Properly supports list type of field', () => {
    @ObjectType()
    class Foo {
      @Field({ type: [String] })
      bar: string[];
    }

    const { bar } = compileObjectType(Foo).getFields();
    expect(isNamedType(bar.type)).toBe(false);
    expect(getNamedType(bar.type)).toBe(GraphQLString);
  });

  it('Is properly passing `this` default values', async () => {
    @ObjectType()
    class Foo {
      private instanceVar = 'instance';
      @Field() bar: string = this.instanceVar;
    }
    const { bar } = compileObjectType(Foo).getFields();
    const resolvedValue = await bar.resolve(new Foo(), null, null, null);
    expect(resolvedValue).toEqual('instance');
  });
});
