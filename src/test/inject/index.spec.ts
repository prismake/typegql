import {
  Inject,
  ObjectType,
  Field,
  compileObjectType,
  Arg,
  Context,
  Source,
  Info,
} from '~/domains';

import { wait } from '../utils';

describe('@Inject', () => {
  it('Properly injects any value', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Inject(() => 'baz')
        test: string,
      ): string {
        return test;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    const result = await bar.resolve(new Foo(), null, null, null);

    expect(result).toEqual('baz');
  });

  it('Makes injected argument not visible in arguments list', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Inject(() => 'baz')
        test: string,
      ): string {
        return test;
      }
    }

    const { bar } = compileObjectType(Foo).getFields();
    expect(bar.args.length).toEqual(0);
  });

  it('Will throw if trying to mark argument both with @Inject and @Arg', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg()
        @Inject(() => 'baz')
        test: string,
      ): string {
        return test;
      }
    }
    expect(() => compileObjectType(Foo).getFields()).toThrowErrorMatchingSnapshot();
  });

  it('Will properly inject Context, Source and Info', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(@Context context: string, @Source source: Foo, @Info info: any): number {
        if (context === 'context' && source === this && info === null) {
          return 42;
        }
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    expect(await bar.resolve(new Foo(), null, 'context', null)).toEqual(42);
  });

  it('Will properly mix Injected and normal Arguments', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(
        @Arg() zzz: string,
        @Context context: string,
        @Inject(() => 42)
        answer: number,
      ): string {
        return `${zzz}.${context}.${answer}`;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    expect(bar.args.length).toEqual(1);
    expect(await bar.resolve(new Foo(), { zzz: 'zzz' }, 'context', null)).toEqual(
      'zzz.context.42',
    );
  });

  it('Will allow `this` inside injectors', async () => {
    @ObjectType()
    class Foo {
      test = 'test';
      @Field()
      bar(
        @Inject(function() {
          return this.test;
        })
        baz: string,
      ): string {
        return baz;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    expect(await bar.resolve(new Foo(), null, null, null)).toEqual('test');
  });

  it('Will allow injecting async values', async () => {
    @ObjectType()
    class Foo {
      test = 'test';
      @Field()
      bar(
        @Inject(async () => {
          await wait(1);
          return 'async';
        })
        baz: string,
      ): string {
        return baz;
      }
    }
    const { bar } = compileObjectType(Foo).getFields();
    expect(await bar.resolve(new Foo(), null, null, null)).toEqual('async');
  });
});
