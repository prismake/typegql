import {
  Field,
  Query,
  ObjectType,
  compileSchema,
  SchemaRoot,
  InterfaceType
} from '../../index'
import { GraphQLInt, graphql, printSchema } from 'graphql'

describe('InterfaceType', () => {
  @InterfaceType({ description: 'a vehicle interface for a basic spec' })
  abstract class IEntity {
    @Field({ type: GraphQLInt })
    id: number
  }

  @InterfaceType({ description: 'a vehicle interface for a basic spec' })
  abstract class IVehicle {
    @Field({ type: GraphQLInt })
    windows: number

    @Field({ type: GraphQLInt })
    seats: number
  }

  @ObjectType({ implements: [IVehicle, IEntity] })
  class Car implements IVehicle, IEntity {
    @Field({ type: GraphQLInt })
    id: number

    windows: number
    seats: number
    @Field()
    wheels: number
  }

  @ObjectType({ implements: [IVehicle, IEntity] })
  class Boat implements IVehicle, IEntity {
    @Field({ type: GraphQLInt })
    id: number

    windows: number
    seats: number

    @Field()
    propellers: number | null
  }

  @ObjectType({ implements: [IVehicle, IEntity] })
  class Katamaran extends Boat implements IEntity {
    @Field({ type: GraphQLInt })
    id: number

    @Field()
    hulls: number
  }

  @SchemaRoot()
  class FooSchema {
    @Query({ type: [IVehicle] })
    vehicles(): IVehicle[] {
      const car = new Car()
      car.seats = 4
      car.windows = 6
      car.wheels = 4

      const boat = new Boat()
      boat.seats = 150
      boat.windows = 30
      return [car, boat]
    }

    @Query({ type: [IVehicle] })
    entities(): IVehicle[] {
      const car = new Car()
      car.id = 1

      car.seats = 4
      car.windows = 6
      car.wheels = 4

      const boat = new Boat()
      boat.id = 2
      boat.seats = 150
      boat.windows = 30
      return [car, boat]
    }
    // we need to test that the Boat and Car Object types get exposed-this is not granted because GraphQLSchema needs these types passed as extra parm in the constructor. They won't be added just by the fact that we're exposing an interface that these Object types implement.
  }

  @SchemaRoot()
  class FooSchemaMoreComplex {
    @Query({ type: [IVehicle] })
    vehicles(): IVehicle[] {
      const car = new Car()
      car.seats = 4
      car.windows = 6
      car.wheels = 4

      const boat = new Boat()
      boat.seats = 150
      boat.windows = 30

      const katamaran = new Katamaran()
      katamaran.propellers = 2
      katamaran.hulls = 2

      return [car, boat, katamaran]
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
      "\\"\\"\\"a vehicle interface for a basic spec\\"\\"\\"
      interface IVehicle {
        windows: Int
        seats: Int
      }

      \\"\\"\\"a vehicle interface for a basic spec\\"\\"\\"
      interface IEntity {
        id: Int
      }

      type Car implements IVehicle & IEntity {
        id: Int
        wheels: Float!
        windows: Int
        seats: Int
      }

      type Boat implements IVehicle & IEntity {
        id: Int
        propellers: Float
        windows: Int
        seats: Int
      }

      type Katamaran implements IVehicle & IEntity {
        id: Int
        propellers: Float
        hulls: Float!
        windows: Int
        seats: Int
      }

      type Query {
        vehicles: [IVehicle!]!
        entities: [IVehicle!]!
      }"
    `)
    expect(printSchema(schemaMoreComplex)).toMatchSnapshot()
  })
  it('should resolve correctly', async () => {
    expect(
      await graphql({
        schema,
        source: `
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
      })
    ).toMatchSnapshot()
  })
  it('should resolve correctly even when extending another implemetor type', async () => {
    expect(
      await graphql({
        schema: schemaMoreComplex,
        source: `
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

              ... on Katamaran {
                hulls
              }
            }
          }
        `
      })
    ).toMatchSnapshot()
  })
})
