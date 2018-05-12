import { ObjectType, Field, Before, After, compileObjectType } from '~/domains';

describe('Hooks', () => {
  it('Will call @Before hook on field resolve', async () => {
    const callback = jest.fn();
    @ObjectType()
    class Foo {
      @Field()
      @Before(callback)
      bar: string = 'done';
    }

    const { bar } = compileObjectType(Foo).getFields();

    await bar.resolve(null, null, null, null);

    expect(callback).toBeCalled();
  });

  it('Will properly pass data to @Before and @After hooks', async () => {
    const beforeCb = jest.fn();
    const afterInnerCb = jest.fn();
    const afterCb = jest.fn(({ context }) => {
      afterInnerCb(context);
    });
    @ObjectType()
    class Foo {
      @Field()
      @Before(beforeCb)
      @Before(afterCb)
      bar: string = 'done';
    }

    const { bar } = compileObjectType(Foo).getFields();

    await bar.resolve('foo', { bar: 42 }, 'baz', null);

    expect(beforeCb).toBeCalledWith({
      args: { bar: 42 },
      context: 'baz',
      info: null,
      source: 'foo',
    });

    expect(beforeCb).toBeCalledWith({
      args: { bar: 42 },
      context: 'baz',
      info: null,
      source: 'foo',
    });

    expect(afterInnerCb).toBeCalledWith('baz');
  });

  it('Will stop resolution when @Before hook throws an error', async () => {
    const beforeCb = jest.fn(() => {
      throw new Error('Foo Error');
    });

    const afterCb = jest.fn();
    const innerCb = jest.fn();

    @ObjectType()
    class Foo {
      @Field()
      @Before(beforeCb)
      @After(afterCb)
      bar(): string {
        innerCb();
        return 'foo';
      }
    }

    const { bar } = compileObjectType(Foo).getFields();

    async function exec() {
      await bar.resolve(null, null, null, null);
    }

    expect(exec()).rejects.toMatchSnapshot();

    expect(beforeCb).toBeCalled();
    expect(afterCb).not.toBeCalled();
    expect(innerCb).not.toBeCalled();
  });

  it('Will call @After hook on field resolve', async () => {
    const callback = jest.fn();
    @ObjectType()
    class Foo {
      @Field()
      @After(callback)
      bar: string = 'done';
    }

    const { bar } = compileObjectType(Foo).getFields();

    await bar.resolve(null, null, null, null);

    expect(callback).toBeCalled();
  });

  it('Will call @Before cb first, then resolver, and then @After cb', async () => {
    const beforeCb = jest.fn();
    const resolverCb = jest.fn();
    const afterCb = jest.fn();

    let counter: number = 0;

    const incrementAndCall = (cb: Function) => () => {
      counter++;
      cb(counter);
    };

    @ObjectType()
    class Foo {
      @Field()
      @Before(incrementAndCall(beforeCb))
      @After(incrementAndCall(afterCb))
      bar(): string {
        incrementAndCall(resolverCb)();
        return 'done';
      }
    }

    const { bar } = compileObjectType(Foo).getFields();

    const result = await bar.resolve(null, null, null, null);

    expect(beforeCb).toBeCalledWith(1);
    expect(resolverCb).toBeCalledWith(2);
    expect(afterCb).toBeCalledWith(3);
    expect(result).toEqual('done');
  });
});
