import { graphql, printSchema } from 'graphql'
import {
  ObjectType,
  InterfaceType,
  Field,
  SchemaRoot,
  Query,
  compileSchema,
  interfaceClassesSet
} from '../index'

interface IHasMyProp {
  myProp: number
}
@ObjectType()
class Mixin {
  @Field()
  mixinMethod(this: IHasMyProp, a: string): string {
    expect(this.myProp).toBe(5)
    return `hello from mixin ${a}`
  }
  // TODO enable this test when https://github.com/Microsoft/TypeScript/issues/29427 is resolved
  // mixinMethodWithContext(this: IHasMyProp, a: string, @Context ctx: any): string {
  //   expect(this.myProp).toBe(5)
  //   return `hello from mixin ${a}`
  // }
}

@InterfaceType({ mixins: [Mixin] })
class InterfaceSampleType implements IHasMyProp {
  myProp = 4
  @Field()
  interfaceMethod(name: string): string {
    return `Hello, ${name}`
  }
}

@ObjectType({ implements: [InterfaceSampleType], mixins: [Mixin] })
class ImplementorType extends InterfaceSampleType {
  myProp = 5
  @Field()
  world(name: string): string {
    return `Hello, ${name}`
  }
}

@ObjectType({ mixins: [Mixin] })
class Hello implements IHasMyProp {
  myProp = 5
  @Field()
  world(name: string): string {
    return `Hello, ${name}`
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }
  @Query({ type: InterfaceSampleType })
  interfaceReturning(): InterfaceSampleType {
    return new ImplementorType()
  }
}

const schema = compileSchema(FooSchema)

describe('Query a mixin method', () => {
  it('executes and field method has correct context', async () => {
    expect(printSchema(schema)).toMatchSnapshot()

    const result = await graphql({
      schema,
      source: `
        {
          hello {
            mixinMethod(a: "Bob1")
          }
          interfaceReturning {
            mixinMethod(a: "Bob2")
          }
        }
      `
    })

    expect(result).toMatchSnapshot()
    interfaceClassesSet.clear()
  })

  it('throws', async () => {
    @ObjectType({ mixins: [undefined] })
    class Hello implements IHasMyProp {
      myProp = 5
      @Field()
      world(name: string): string {
        return `Hello, ${name}`
      }
    }

    @SchemaRoot()
    class FooSchema {
      @Query()
      hello(): Hello {
        return new Hello()
      }
    }

    expect(() => {
      compileSchema(FooSchema)
    }).toThrowErrorMatchingInlineSnapshot(
      `"expected a mixin on Hello to be a Class, instead value of index 0 is undefined"`
    )
  })

  it('accepts a thunk to avoid circular refs', async () => {
    class Mixin {
      @Field()
      mixinMethod(this: IHasMyProp, a: string): string {
        expect(this.myProp).toBe(5)
        return `hello from mixin ${a}`
      }
    }
    let mixinSimulatedAsCircularDep: Function | undefined = undefined

    @ObjectType({ mixins: () => [mixinSimulatedAsCircularDep] })
    class Hello implements IHasMyProp {
      myProp = 5
      @Field()
      world(name: string): string {
        return `Hello, ${name}`
      }
    }

    @SchemaRoot()
    class FooSchema {
      @Query()
      hello(): Hello {
        return new Hello()
      }
    }

    const schemaCompiled = compileSchema(FooSchema)

    mixinSimulatedAsCircularDep = Mixin

    expect(printSchema(schemaCompiled)).toMatchSnapshot()
  })
})
