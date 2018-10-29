import {
  Field,
  Query,
  ObjectType,
  compileSchema,
  SchemaRoot,
  InterfaceType
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
    // we need to test that the Boat and Car Object types get exposed-this is not granted because GraphQLSchema needs these types passed as extra parm in the constructor. They won't be added just by the fact that we're exposing an interface that these Object types implement.
  }

  @SchemaRoot()
  class FooSchemaMoreComplex {
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
    @Query({ type: Boat })
    boat(): Boat {
      const boat = new Boat()
      boat.seats = 150
      boat.windows = 30
      return boat
    }
    @Query({ type: Car })
    car(): Car {
      const car = new Car()
      car.seats = 4
      car.windows = 6
      car.wheels = 4
      return car
    }
  }

  const schema = compileSchema(FooSchema)
  const schemaMoreComplex = compileSchema(FooSchemaMoreComplex)

  it('should expose GQL interface type', async () => {
    expect(printSchema(schema)).toMatchInlineSnapshot(`
"type Boat implements Vehicle {
  propellers: Float
  windows: Int
  seats: Int
}

type Car implements Vehicle {
  wheels: Float
  windows: Int
  seats: Int
}

type Query {
  vehicles: [Vehicle!]
}

\\"\\"\\"a vehicle interface for a basic spec\\"\\"\\"
interface Vehicle {
  windows: Int
  seats: Int
}
"
`)
    expect(printSchema(schemaMoreComplex)).toMatchSnapshot()
  })
  it('should resolve correctly', async () => {
    expect(
      await graphql(
        schema,
        `
          {
            vehicles {
              seats
              windows
              __typename
              ... on Car {
                wheels
              }
              ... on Boat {
                propellers
              }
            }
          }
        `
      )
    ).toMatchSnapshot()

    expect(
      await graphql(
        schemaMoreComplex,
        `
          {
            car {
              seats
              windows
              __typename
              wheels
            }
            boat {
              seats
              windows
              __typename
              propellers
            }
          }
        `
      )
    ).toMatchSnapshot()
  })
})
