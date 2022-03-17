import { compileSchema, Field, ObjectType, Query, SchemaRoot } from '../index'
import { runBenchmark } from './run'

@ObjectType()
class SampleObject {
  @Field()
  sampleField!: string

  @Field({ type: SampleObject })
  nestedField?: SampleObject
}

@SchemaRoot()
class Schema {
  @Query({ type: SampleObject })
  singleObject(): SampleObject {
    return { sampleField: 'sampleField' }
  }

  @Query({ type: SampleObject })
  nestedObject(): SampleObject {
    return {
      sampleField: 'sampleField',
      nestedField: {
        sampleField: 'sampleField',
        nestedField: {
          sampleField: 'sampleField',
          nestedField: {
            sampleField: 'sampleField',
            nestedField: {
              sampleField: 'sampleField'
            }
          }
        }
      }
    }
  }
}

export const schema = compileSchema(Schema)
;(async () => {
  await runBenchmark(schema)
})()
