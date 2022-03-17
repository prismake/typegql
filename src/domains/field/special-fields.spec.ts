import { ObjectType, Query, compileObjectType } from '../..'

describe('Special fields - @Query, @Mutation @Subscribe', () => {
  it('Will not allow registering special type on type that is not @SchemaRoot', () => {
    @ObjectType()
    class Foo {
      @Query()
      bar(): string {
        // @ts-expect-error
        return null
      }
    }

    expect(() => {
      return compileObjectType(Foo).getFields()
    }).toThrowErrorMatchingInlineSnapshot(
      `"@ObjectType Foo.bar: Given field is root field (@Query or @Mutation) not registered inside @SchemaRoot type. "`
    )
  })
})
