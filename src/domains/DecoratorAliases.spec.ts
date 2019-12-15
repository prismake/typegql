import { printSchema } from 'graphql'
import { DuplexObjectType, SchemaRoot, compileSchema } from '../index'

import { ArgNullable } from './arg/ArgDecorators'
import { QueryAndMutation } from './schema/rootFields'

import { InputFieldNullable } from './inputField/InputFieldDecorators'
import { DuplexField } from './duplexField/DuplexField'
import { ArrayField } from './field/Field'

describe('decorator aliases', () => {
  it('should compile', async () => {
    @DuplexObjectType()
    class Bar {
      @InputFieldNullable()
      foo2: string
      @DuplexField()
      foo(@ArgNullable() a: string): string {
        return a
      }
    }

    @SchemaRoot()
    class FooSchema {
      @QueryAndMutation()
      output(): Bar {
        return new Bar()
      }
      @QueryAndMutation()
      echo(input: Bar): Bar {
        return new Bar()
      }
    }
    const schema = compileSchema(FooSchema)
    expect(printSchema(schema)).toMatchSnapshot()
  })

  describe('ArrayField', () => {
    it('should define the field correctly', async () => {
      @DuplexObjectType()
      class Bar {
        @ArrayField({ itemType: String })
        foo2: string
        @ArrayField({ itemType: String, itemNullable: true })
        foo4: string
        @ArrayField({ itemType: () => String })
        foo(@ArgNullable() a: string): string[] {
          return []
        }
        @ArrayField({ itemType: Number })
        foo3() {
          return [1, 2, 3]
        }
      }

      @SchemaRoot()
      class FooSchema {
        @QueryAndMutation()
        output(): Bar {
          return new Bar()
        }
      }
      const schema = compileSchema(FooSchema)
      expect(printSchema(schema)).toMatchSnapshot()
    })
  })
})
