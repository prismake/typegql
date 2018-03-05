# Object types

Object types are main building block of any graphql schema. In `typegql` - `ObjectType` is equivalent to `GraphQLObjectType`.

To define new object type, decorate any class with `@ObjectType` decorator.

```ts
import { ObjectType } from 'typegql';

@ObjectType()
class MyType {
  // fields will be defined here
}
```

## Fields

Every `ObjectType` must have at least one field. To create new field, decorate any property or method of `ObjectType` class with `@Field` decorator:

```ts
import { ObjectType, Field } from 'typegql';

@ObjectType()
class MyType {
  @Field() foo: string;

  @Field()
  fooMethod(): string {
    return 'fooMethodResult';
  }
}
```

## Nested Sub-types

To build nested structure of objects - every field can use another `ObjectType` as it's type

```ts
import { ObjectType, Field } from 'typegql';

@ObjectType()
class Location {
  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  @Field() lat: number;
  @Field() lng: number;
}

@ObjectType()
class Restaurant {
  @Field() name: string;

  @Field()
  location(): Location {
    return new Location(50, 50);
  }
}
```

## Circular type references

In other to define circular references. Eg. car have owner, owner has cars which have owner. it's required to assign types in lazy way (with getter functions)

To do so, we'll use `@Field` with `type` option.

```ts
import { ObjectType, Field } from 'typegql';

@ObjectType()
class Car {
  @Field({ type: () => Person })
  owner() {
    return db.findPersonByCarId(this.id);
  }
  @Field() id: number;
}

@ObjectType()
class Person {
  @Field() id: number;
  @Field() name: string;
  @Field({ type: () => Car })
  car() {
    return db.findCarByOwnerId(this.id);
  }
}
```
