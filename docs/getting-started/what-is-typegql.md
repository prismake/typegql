`typegql` is set of decorators allowing creating GraphQL APIs quickly and in type-safe way.

## Minimal Example

Schema able to handle such query:

```graphql
{
  hello {
    world(name: "Bob") # will resolve with `Hello world, Bob`
  }
}
```

Can be created with:

```typescript
import { Schema, Query, ObjectType, Field, compileSchema } from 'typegql';

@ObjectType()
class Hello {
  @Field()
  world(name: string): string {
    return `Hello world, ${name}!`;
  }
}

@Schema()
class MyFirstSchema {
  @Query()
  hello(): Hello {
    return new Hello();
  }
}

const schema = compileSchema(MyFirstSchema);
```
