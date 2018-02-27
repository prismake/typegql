import { GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql';
import { Type, Field, compileType } from 'domains';

import 'reflect-metadata';

describe('Field', () => {
  it('Resolves fields with default value', async () => {
    @Type()
    class Foo {
      @Field() bar: string = 'baz';
    }
    const compiled = compileType(Foo);
    const barField = compiled.getFields().bar;
    expect(await barField.resolve(new Foo(), {}, null, null)).toEqual('baz');
  });

  it('Resolves fields with function resolver', async () => {
    @Type()
    class Foo {
      @Field()
      bar(): string {
        return 'baz';
      }
    }

    const compiled = compileType(Foo);
    const barField = compiled.getFields().bar;

    expect(await barField.resolve(new Foo(), {}, null, null as any)).toEqual('baz');
  });

  it('Handles description', () => {
    @Type()
    class Foo {
      @Field({ description: 'test' })
      bar: string = 'baz';
    }
    expect(compileType(Foo).getFields().bar.description).toEqual('test');
  });

  it('Handles custom name', async () => {
    @Type()
    class Foo {
      @Field({ name: 'baz', description: 'test' })
      bar: string = 'test';
    }
    const compiled = compileType(Foo);
    const bazField = compiled.getFields().baz;
    expect(compiled.getFields().bar).toBeFalsy();
    expect(bazField).toBeTruthy();
    expect(bazField.description).toEqual('test');
    expect(await bazField.resolve(new Foo(), {}, null, null as any)).toBe('test');
  });

  it('Properly infers basic scalar types', () => {
    @Type()
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

    const { bar, baz, foo, boo, coo } = compileType(Foo).getFields();

    expect(bar.type).toEqual(GraphQLString);
    expect(baz.type).toEqual(GraphQLFloat);
    expect(foo.type).toEqual(GraphQLBoolean);
    expect(boo.type).toEqual(GraphQLBoolean);
    expect(coo.type).toEqual(GraphQLBoolean);
  });

  it('Properly sets forced field type', () => {
    @Type()
    class Foo {
      @Field({ type: () => GraphQLFloat })
      bar: string;
    }

    const { bar } = compileType(Foo).getFields();
    expect(bar.type).toEqual(GraphQLFloat);
  });

  it('Supports references to other types', () => {
    @Type()
    class Foo {
      @Field() foo: string;
    }

    @Type()
    class Bar {
      @Field() foo: Foo;
    }

    const { foo } = compileType(Bar).getFields();
    const compiledFoo = compileType(Foo);
    expect(foo.type).toBe(compiledFoo);
  });

  it('Supports references to itself', () => {
    @Type()
    class Foo {
      @Field() fooNested: Foo;
    }

    const { fooNested } = compileType(Foo).getFields();
    expect(fooNested.type).toBe(compileType(Foo));
  });

  it('Supports circular references', () => {
    @Type()
    class Car {
      @Field({ type: () => Owner })
      owner: Owner;
    }

    @Type()
    class Owner {
      @Field({ type: () => Car })
      car: Car;
    }

    // console.log({ Car, Owner });

    const { owner } = compileType(Car).getFields();
    const { car } = compileType(Owner).getFields();

    // console.log({ owner, car });
    expect(owner.type).toBe(compileType(Owner));
    expect(car.type).toBe(compileType(Car));
  });

  it('Throws if pointing to unregistered type', () => {
    class Foo {}

    @Type()
    class Bar {
      @Field({ type: () => Foo })
      foo: Foo;
    }

    expect(() => compileType(Bar).getFields()).toThrowErrorMatchingSnapshot();
  });
});
