import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  isNamedType,
  getNamedType,
  graphql
} from 'graphql'

import 'reflect-metadata'
import {
  ObjectType,
  Field,
  compileObjectType,
  SchemaRoot,
  Query,
  compileSchema
} from '../..'
import { GraphQLDateTime } from 'graphql-iso-date'
import { ArrayField } from './Field'

describe('Field', () => {
  it('Resolves fields with default value', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar: string = 'baz'
    }
    const compiled = compileObjectType(Foo)
    const barField = compiled.getFields().bar

    expect(await barField.resolve(new Foo(), {}, null, null)).toEqual('baz')
  })

  it('Resolves fields with function resolver', async () => {
    @ObjectType()
    class Foo {
      @Field()
      bar(): string {
        return 'baz'
      }
    }

    const compiled = compileObjectType(Foo)
    const barField = compiled.getFields().bar

    expect(await barField.resolve(new Foo(), {}, null, null as any)).toEqual(
      'baz'
    )
  })

  it('Handles description', () => {
    @ObjectType()
    class Foo {
      @Field({ description: 'test' })
      bar: string = 'baz'
    }
    expect(compileObjectType(Foo).getFields().bar.description).toEqual('test')
  })

  it('Handles custom name', async () => {
    @ObjectType()
    class Foo {
      @Field({ name: 'baz', description: 'test' })
      bar: string = 'test'
    }
    const compiled = compileObjectType(Foo)
    const bazField = compiled.getFields().baz
    expect(compiled.getFields().bar).toBeFalsy()
    expect(bazField).toBeTruthy()
    expect(bazField.description).toEqual('test')
    expect(await bazField.resolve(new Foo(), {}, null, null as any)).toBe(
      'test'
    )
  })

  it('Properly infers basic scalar types', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar: string
      @Field()
      baz: number
      @Field()
      foo: boolean
      @Field()
      coo: boolean = false
      @Field()
      boo(): boolean {
        return true
      }
    }

    const { bar, baz, foo, boo, coo } = compileObjectType(Foo).getFields()

    expect(bar.type).toEqual(GraphQLString)
    expect(baz.type).toEqual(GraphQLFloat)
    expect(foo.type).toEqual(GraphQLBoolean)
    expect(boo.type).toEqual(GraphQLBoolean)
    expect(coo.type).toEqual(GraphQLBoolean)
  })

  it('Properly sets explicit field type', () => {
    @ObjectType()
    class Foo {
      @Field({ type: () => GraphQLFloat })
      bar: string
    }

    const { bar } = compileObjectType(Foo).getFields()
    expect(bar.type).toEqual(GraphQLFloat)
  })

  it('Supports references to other types', () => {
    @ObjectType()
    class Foo {
      @Field()
      foo: string
    }

    @ObjectType()
    class Bar {
      @Field()
      foo: Foo
    }

    const { foo } = compileObjectType(Bar).getFields()
    const compiledFoo = compileObjectType(Foo)
    expect(foo.type).toBe(compiledFoo)
  })

  it('Supports references to itself', () => {
    @ObjectType()
    class Foo {
      @Field()
      fooNested: Foo
    }

    const { fooNested } = compileObjectType(Foo).getFields()
    expect(fooNested.type).toBe(compileObjectType(Foo))
  })

  it('Supports circular references', () => {
    @ObjectType()
    class Car {
      @Field({ type: () => Owner })
      owner: any
    }

    @ObjectType()
    class Owner {
      @Field({ type: () => Car })
      car: any
    }

    const { owner } = compileObjectType(Car).getFields()
    const { car } = compileObjectType(Owner).getFields()

    expect(owner.type).toBe(compileObjectType(Owner))
    expect(car.type).toBe(compileObjectType(Car))
  })

  it('Throws if pointing to unregistered type', () => {
    class Foo {}

    @ObjectType()
    class Bar {
      @Field({ type: () => Foo })
      foo: Foo
    }

    expect(() =>
      compileObjectType(Bar).getFields()
    ).toThrowErrorMatchingInlineSnapshot(
      `"@ObjectType Bar.foo: Explicit type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator"`
    )
  })

  it('Properly resolves native scalar types', () => {
    @ObjectType()
    class Foo {
      @Field({ type: () => String })
      bar: any
      @Field({ type: () => Number })
      baz: any
      @Field()
      date: Date
      @Field()
      bool: boolean
    }

    const { bar, baz, date, bool } = compileObjectType(Foo).getFields()
    expect(bar.type).toBe(GraphQLString)
    expect(baz.type).toBe(GraphQLFloat)
    expect(date.type).toBe(GraphQLDateTime)
    expect(bool.type).toBe(GraphQLBoolean)
  })

  it('throws an error when explicit type is "undefined"', (done) => {
    try {
      @ObjectType()
      class Foo {
        @Field({ type: undefined, isNullable: false })
        bar: string
      }

      expect(Foo).toBeTruthy()
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [TypeError: Field "bar" on class Foo {
                    } got an "undefined" as explicit type]
      `)
      done()
    }
  })

  it('Shows proper error message when trying to use list type without being explicit about item type', () => {
    @ObjectType()
    class Foo {
      @Field()
      bar: string[]
    }

    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingInlineSnapshot(
      `"@ObjectType Foo.bar: Field type was infered as \\"function Array() { [native code] }\\" so it's required to explicitly set the type as it's not possible to guess it. Pass it in a config for the field like: @Field({ type: ItemType })"`
    )
  })

  it('Shows proper error message when trying to use promise type without being explicit about item type', () => {
    @ObjectType()
    class Foo {
      @Field()
      async bar() {
        return 'baz'
      }
    }

    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingInlineSnapshot(
      `"@ObjectType Foo.bar: Field type was infered as \\"function Promise() { [native code] }\\" so it's required to explicitly set the type as it's not possible to guess it. Pass it in a config for the field like: @Field({ type: ItemType })"`
    )
  })

  it('Properly supports list type of field', () => {
    @ObjectType()
    class Foo {
      @Field({ type: [String] })
      bar: string[]
    }

    const { bar } = compileObjectType(Foo).getFields()
    expect(isNamedType(bar.type)).toBe(false)
    expect(getNamedType(bar.type)).toBe(GraphQLString)
  })

  it('Is properly passing `this` default values', async () => {
    @ObjectType()
    class Foo {
      private instanceVar = 'instance'
      @Field()
      bar: string = this.instanceVar
    }
    const { bar } = compileObjectType(Foo).getFields()
    const resolvedValue = await bar.resolve(new Foo(), null, null, null)
    expect(resolvedValue).toEqual('instance')
  })

  it('Will not allow promise field without type addnotation', async () => {
    @ObjectType()
    class Foo {
      @Field()
      async bar(): Promise<number> {
        return 10
      }
    }

    expect(() =>
      compileObjectType(Foo).getFields()
    ).toThrowErrorMatchingInlineSnapshot(
      `"@ObjectType Foo.bar: Field type was infered as \\"function Promise() { [native code] }\\" so it's required to explicitly set the type as it's not possible to guess it. Pass it in a config for the field like: @Field({ type: ItemType })"`
    )
  })

  it('Properly resolves edge cases default values of fields', async () => {
    @ObjectType()
    class Foo {
      @Field()
      undef: boolean = undefined
      @Field()
      falsy: boolean = false
      @Field()
      truthy: boolean = true
      @Field()
      nully: boolean = null
      @Field()
      zero: number = 0
      @Field()
      maxInt: number = Number.MAX_SAFE_INTEGER
    }
    const compiled = compileObjectType(Foo)

    const { undef, falsy, truthy, nully, zero, maxInt } = compiled.getFields()

    const foo = new Foo()

    expect(await undef.resolve(foo, {}, null, null)).toEqual(undefined)
    expect(await falsy.resolve(foo, {}, null, null)).toEqual(false)
    expect(await truthy.resolve(foo, {}, null, null)).toEqual(true)
    expect(await nully.resolve(foo, {}, null, null)).toEqual(null)
    expect(await zero.resolve(foo, {}, null, null)).toEqual(0)
    expect(await maxInt.resolve(foo, {}, null, null)).toEqual(9007199254740991)
  })

  it('Will not allow a field to overwrite another', async () => {
    @ObjectType()
    class Foo {
      bar(): number {
        return 10
      }
    }

    const decorate = Field({
      type: Number
    })
    decorate(Foo.prototype, 'bar')
    const decorate2 = Field({
      type: String
    })

    expect(() =>
      decorate2(Foo.prototype, 'bar')
    ).toThrowErrorMatchingInlineSnapshot(
      `"Field \\"bar\\" on class Foo cannot be registered-it's already registered as type Number"`
    )
  })

  describe('IFieldOptions', () => {
    @ObjectType()
    class Foo {
      baz = 'baz'
      @Field()
      bar(): string {
        return this.baz
      }

      @Field({ castTo: Foo })
      castedField() {
        return { baz: 'castedFromAField' }
      }
      @Field({ castTo: () => Foo })
      castedFieldDefinedAsThunk() {
        return { baz: 'castedFromAField' }
      }
      @Field({ castTo: Foo })
      castedFieldNullReturning(): Foo {
        return null
      }

      @Field({ castTo: [Foo] })
      castedFieldAsArray() {
        return [{ baz: 'castedFromAField1' }, { baz: 'castedFromAField2' }]
      }

      @Field({ castTo: () => [Foo] })
      castedFieldAsArrayDefinedAsThunk() {
        return [{ baz: 'castedFromAField1' }, { baz: 'castedFromAField2' }]
      }

      @ArrayField({ itemCast: () => Foo })
      castedArrayFieldDefinedAsThunk() {
        return [{ baz: 'castedFromAField1' }, { baz: 'castedFromAField2' }]
      }

      @ArrayField({ itemCast: Foo })
      castedArrayField() {
        return [{ baz: 'castedFromAField1' }, { baz: 'castedFromAField2' }]
      }
    }

    @SchemaRoot()
    class FooSchema {
      @Query({ castTo: Foo })
      castedQuery() {
        return { baz: 'castedFromAQuery' }
      }
    }
    const schema = compileSchema(FooSchema)

    it('should register a field with castTo', async () => {
      const result = await graphql(
        schema,
        `
          {
            castedQuery {
              bar
              castedField {
                bar
              }
              castedFieldDefinedAsThunk {
                bar
              }
              castedFieldNullReturning {
                bar
              }
              castedFieldAsArrayDefinedAsThunk {
                bar
              }
              castedArrayFieldDefinedAsThunk {
                bar
              }
              castedArrayField {
                bar
              }
            }
          }
        `
      )

      expect(result.errors).toBeUndefined()
      expect(result.data.castedQuery).toMatchInlineSnapshot(`
        Object {
          "bar": "castedFromAQuery",
          "castedArrayField": Array [
            Object {
              "bar": "castedFromAField1",
            },
            Object {
              "bar": "castedFromAField2",
            },
          ],
          "castedArrayFieldDefinedAsThunk": Array [
            Object {
              "bar": "castedFromAField1",
            },
            Object {
              "bar": "castedFromAField2",
            },
          ],
          "castedField": Object {
            "bar": "castedFromAField",
          },
          "castedFieldAsArrayDefinedAsThunk": Array [
            Object {
              "bar": "castedFromAField1",
            },
            Object {
              "bar": "castedFromAField2",
            },
          ],
          "castedFieldDefinedAsThunk": Object {
            "bar": "castedFromAField",
          },
          "castedFieldNullReturning": null,
        }
      `)
    })

    it('should be able to castTo an array of classes', async () => {
      const result = await graphql(
        schema,
        `
          {
            castedQuery {
              bar
              castedFieldAsArray {
                bar
              }
            }
          }
        `
      )

      expect(result.errors).toBeUndefined()
      expect(result.data.castedQuery).toMatchInlineSnapshot(`
        Object {
          "bar": "castedFromAQuery",
          "castedFieldAsArray": Array [
            Object {
              "bar": "castedFromAField1",
            },
            Object {
              "bar": "castedFromAField2",
            },
          ],
        }
      `)
    })
  })
})
