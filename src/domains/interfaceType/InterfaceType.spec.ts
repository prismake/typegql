import {
  Field,
  Query,
  ObjectType,
  compileSchema,
  SchemaRoot,
  InterfaceType,
} from '..'
import { GraphQLInt, graphql, printSchema } from 'graphql'

describe('InterfaceType', () => {
  @InterfaceType({ description: 'a vehicle interface for a basic spec' })
  abstract class Vehicle {
    @Field({ type: GraphQLInt })
    windows: number

    @Field({ type: GraphQLInt })
    seats: number
  }

  @ObjectType({ implements: Vehicle })
  class Car implements Vehicle {
    windows: number
    seats: number
    @Field()
    wheels: number
  }

  @ObjectType({ implements: Vehicle })
  class Boat implements Vehicle {
    windows: number
    seats: number

    @Field()
    propellers: number
  }

  @SchemaRoot()
  class FooSchema {
    @Query({ type: [Vehicle] })
    vehicles(): Vehicle[] {
      const car = new Car()
      car.seats = 4
      car.windows = 6
      car.wheels = 4

      const boat = new Boat()
      boat.seats = 150
      boat.windows = 30
      return [car, boat]
    }
    // @Query({ type: Boat })
    // boat(): Boat {
    //   const boat = new Boat()
    //   boat.seats = 150
    //   boat.windows = 30
    //   return boat
    // }
  }

  const schema = compileSchema(FooSchema)

  it('should expose GQL interface', async () => {
    expect(printSchema(schema)).toMatchSnapshot()
  })
  it('should resolve', async () => {
    expect(
      await graphql(
        schema,
        `
          {
            vehicles {
              seats
              windows
              #propellers
            }
          }
        `,
      ),
    ).toMatchSnapshot()
  })
})
