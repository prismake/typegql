# `@Before` and `@After` hooks

Let's say we want to send informations about useage of some field of our graphql api to analitycs server. We could achieve that with:

```ts
import { ObjectType, Field, After } from 'typegql';

@ObjectType()
class Person {
  @Field() id: number;

  @Field()
  @After(() => {
    loggingService.sendLog(`User was removed`);
  })
  remove(): boolean {
    const isDeleted = userService.removeById(this.id);
    return isDeleted;
  }
}
```

## Using resolver informations inside hook function

Arguments passed to resolver are exactly the same, as ones passed to native graphql resolver funtion. Signature of hook function is

`(source, arguments, context, info) => void`

In case, we'd like to add id of removed user to logs, we'd change our code to:

```ts
@ObjectType()
class Person {
  @Field() id: number;

  @Field()
  @After(() => {
    loggingService.sendLog(`User with id ${this.id} may have been removed(if it was found)`); 
  })
  remove(): boolean {
    const isDeleted = userService.removeById(this.id);
    return isDeleted;
  }
}
```

## Notes

* If one field has many hooks of the same type - they're executed in parallel.
* Field resolver is not called until all @Before hooks are resolved
