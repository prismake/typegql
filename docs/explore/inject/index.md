# Injecting value to resolver

Quite often we need to have access to graphql context inside resolver. Common example could be field like `viewer`

```graphql
{
  viewer {
    me {
      username
    }
  }
}
```

## Built-in injectors `@Context`, `@Source`, `@Info`

There are 3 argument decorators in `typegql` that allow passing values to resolvers - `@Context`, `@Source`, `@Info`

Implementation of `Viewer` type would use `@Context` decorator to get user id from graphql context and could look like:

```ts
import { ObjectType, Field, Context } from 'typegql';

@ObjectType()
class Viewer {
  @Field({ type: () => Person })
  me(@Context context) {
    return db.findUserById(context.currentUser.id);
  }
  @Field() id: number;
}
```

## Custom injector with `@Inject`

Beside built-in injectors you can use `@Inject` decorator to pass any value to given argument.

`@Inject` decorator requires getter function that converts resolve info to any arbitral value. **Note you can return promise of any value, too**.

```ts
import { ObjectType, Field, Inject } from 'typegql';

@ObjectType()
class Viewer {
  @Field({ type: () => Person })
  me(@Inject({source, args, context, info} => 42) someNumber: number): number {
    return someNumber; // it will be 42;
  }
  @Field() id: number;
}
```

## Notes

* Decorated arguments are not present in `args` list of field schema definition.
