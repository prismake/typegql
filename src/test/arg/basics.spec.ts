import { GraphQLString, GraphQLNonNull } from 'graphql';
import { Field, ObjectType, compileObjectType, Arg } from '~/domains';

describe('Arguments with @Arg', () => {
  it('Allows setting argument with @Arg decorator', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(@Arg() baz: string): string {
        return baz;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();

    expect(bar.args.length).toEqual(1);
    const [bazArg] = bar.args;
    expect(bazArg.type).toEqual(new GraphQLNonNull(GraphQLString));
    expect(bazArg.name).toBe('baz');
  });

  it('Allows setting custom @Arg description', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ description: 'test' })
        baz: string,
      ): string {
        return baz;
      }
    }
    const [bazArg] = compileObjectType(Foo).getFields().bar.args;
    expect(bazArg.description).toBe('test');
  });

  it('Is passing argument value to resolver properly and in proper order', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(aaa: string, zzz: string): string {
        return `${aaa}.${zzz}`;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    const resolvedValue = await bar.resolve(
      new Foo(),
      { zzz: 'zzz', aaa: 'aaa' },
      null,
      null,
    );
    expect(resolvedValue).toEqual('aaa.zzz');
  });

  it('Is properly passing `this` argument', async () => {
    @ObjectType()
    class Foo {
      private instanceVar = 'instance';
      @Field()
      bar(param: string): string {
        return `${this.instanceVar}.${param}`;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    const resolvedValue = await bar.resolve(
      new Foo(),
      { param: 'param' },
      null,
      null,
    );
    expect(resolvedValue).toEqual('instance.param');
  });

  it('Respects isNullable @Arg option', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ isNullable: true })
        baz: string,
        @Arg({ isNullable: false })
        bazRequired: string,
      ): string {
        return baz;
      }
    }
    const [bazArg, bazRequiredArg] = compileObjectType(
      Foo,
    ).getFields().bar.args;
    expect(bazArg.type).toBe(GraphQLString);
    expect(bazRequiredArg.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('Will allow registering argument at runtime', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(baz: string, bazRequired: string): string {
        return baz;
      }
    }

    Arg({ type: String, isNullable: true })(Foo.prototype, 'bar', 0);
    Arg({ type: String, isNullable: false })(Foo.prototype, 'bar', 1);

    const [bazArg, bazRequiredArg] = compileObjectType(
      Foo,
    ).getFields().bar.args;

    expect(bazArg.type).toBe(GraphQLString);
    expect(bazRequiredArg.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('Respects unset defaultValue @Arg option', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ isNullable: true })
        baz: string,
        @Arg({ isNullable: false })
        bazRequired: string,
      ): string {
        return baz;
      }
    }
    const [bazArg, bazRequiredArg] = compileObjectType(
      Foo,
    ).getFields().bar.args;
    expect(bazArg.type).toBe(GraphQLString);
    expect(bazArg.defaultValue).toBe(undefined);
    expect(bazRequiredArg.type).toEqual(new GraphQLNonNull(GraphQLString));
  });

  it('Respects defaultValue @Arg option', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg({ isNullable: true, defaultValue: 'default' })
        baz: string,
      ): string {
        return baz;
      }
    }
    const compiledObject = compileObjectType(Foo);
    const [bazArg] = compiledObject.getFields().bar.args;
    expect(bazArg.type).toBe(GraphQLString);
    expect(bazArg.defaultValue).toBe('default');
  });
});
