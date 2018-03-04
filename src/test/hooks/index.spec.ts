import { ObjectType, Field, Before, After, Guard, compileObjectType } from 'domains';

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

  it('Will not allow resolver to execute if @Guard returns false with error message', async () => {
    const callback = jest.fn();
    @ObjectType()
    class Foo {
      @Guard(
        (source, args) => {
          return args.isAllowed;
        },
        { msg: 'Not allowed' },
      )
      @Field()
      bar(isAllowed: boolean): string {
        callback();
        return 'done';
      }
    }

    const { bar } = compileObjectType(Foo).getFields();

    await expect(
      bar.resolve(null, { isAllowed: false }, null, null),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(callback).not.toBeCalled();
    await expect(bar.resolve(null, { isAllowed: true }, null, null)).resolves.toEqual(
      'done',
    );
    expect(callback).toBeCalled();
  });
});
