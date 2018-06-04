import {
  Query,
  SchemaRoot,
  compileSchema,
  DuplexObjectType,
  DuplexField,
} from '~/domains';
import { graphql } from 'graphql';

describe('duplex object type', () => {
  it('should compile and work', async () => {
    @DuplexObjectType()
    class SecondDuplex {
      constructor(foo: string) {
        this.foo2 = foo;
      }
      @DuplexField() foo2: string;
    }

    @DuplexObjectType()
    class Duplex {
      constructor(foo: string) {
        this.foo = foo;
      }
      @DuplexField() foo: string;
      @DuplexField() fod: SecondDuplex;
    }

    @SchemaRoot()
    class FooSchema {
      @Query()
      output(): SecondDuplex {
        return new SecondDuplex('bar');
      }
      @Query()
      echo(input: Duplex): Duplex {
        expect(input.fod.foo2).toBe('bbb');
        return new Duplex(input.foo);
      }
    }
    const schema = compileSchema({ roots: [FooSchema] });
    const result = await graphql(
      schema,
      `
        {
          output {
            foo2
          }
        }
      `,
    );

    expect(result).toEqual({ data: { output: { foo2: 'bar' } } });

    const result2 = await graphql(
      schema,
      `
        {
          echo(input: { foo: "aaa", fod: { foo2: "bbb" } }) {
            foo
          }
        }
      `,
    );

    expect(result2).toEqual({ data: { echo: { foo: 'aaa' } } });
  });
});
