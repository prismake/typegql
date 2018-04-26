import { Query, Schema, compileSchema, ObjectType, Field } from 'domains';
import { graphql, introspectionQuery, GraphQLSchema } from 'graphql';

describe('@Schema', () => {
  describe('invalid scenarios', () => {
    it('should not allow compiling schema not decorated with @Schema', () => {
      class Foo {}
  
      expect(() => compileSchema(Foo)).toThrowErrorMatchingSnapshot();
    });
  
    it('should not allow @Schema without any @Query field', () => {
      @Schema()
      class Foo {}
  
      expect(() => compileSchema(Foo)).toThrowErrorMatchingSnapshot();
    });
  
  });
  describe('valid scenarios', () => {

    @ObjectType()
    class Hello {
      @Field()
      world(name: string): string {
        return `Hello, ${name}`;
      }
    }

    let instances: any[] = [];

    @Schema()
    class FooSchema {
      
      constructor() {
        instances.push(this);
      }

      @Query()
      hello(): Hello {
        return this.createHelloInstance();
      }

      createHelloInstance() {
        return new Hello();
      }
    }

    @Schema()
    class BarSchema {

      constructor() {
        instances.push(this);
      }

      @Query()
      greet(): Hello {
        return new Hello();
      }
    }
  
    beforeEach(() => {
      instances = [];
    });

    describe('Single Schema', () => {
      it('should generate all schema fields properly for valid schema', async () => {
        const schema = compileSchema(FooSchema);
        expect(await graphql(schema, introspectionQuery)).toMatchSnapshot();
        expect(instances.length).toBe(0);
      });
  
      it('instantiates the schema class and calls resolvers with instance context', async () => {
        const schema = compileSchema(FooSchema);
        expect(await graphql(schema, `
          query { 
            hello { 
              world(name: "graham") 
            } 
          }
        `)).toMatchSnapshot();
        expect(instances.length).toBe(1);
      });
    })

    describe('Multi Schema', () => {
      it('should generate all schema fields properly for valid schema', async () => {
        const schema = compileSchema([
          FooSchema,
          BarSchema
        ]);
        expect(await graphql(schema, introspectionQuery)).toMatchSnapshot();
        expect(instances.length).toBe(0);
      });

      it('instantiates schema classes on demand and calls resolvers with instance context', async () => {
        const schema = compileSchema([
          FooSchema,
          BarSchema
        ]);
        expect(await graphql(schema, `
          query {
            hello {
              world(name: "graham")
            }
          }
        `)).toMatchSnapshot();
        expect(instances.length).toBe(1);
        expect(instances[0]).toBeInstanceOf(FooSchema);
        expect(await graphql(schema, `
          query {
            greet {
              world(name: "graham")
            }
          }
        `)).toMatchSnapshot();
        expect(instances.length).toBe(2);
        expect(instances[1]).toBeInstanceOf(BarSchema);
        expect(await graphql(schema, `
          query {
            hello {
              world(name: "graham")
            }
            greet {
              world(name: "graham")
            }
          }
        `)).toMatchSnapshot();
        expect(instances.length).toBe(4);
        expect(instances[2]).toBeInstanceOf(FooSchema);
        expect(instances[3]).toBeInstanceOf(BarSchema);
      });
    });
  });
});
