# Guard hooks

Guard hooks are special kind of `@Before` hook designed to easy control access to some field

Let's say we have `User` type and we don't want to show `isBanned` field to anyone. We want only admins to be able to see that.

```ts
import { ObjectType, Field, Guard } from 'typegql';

@ObjectType()
class User {
  @Field() name: string;

  @Guard(({source, args, context}) => context.currentUser.isAdmin, { msg: 'Not allowed' })
  @Field()
  isBanned: boolean;
}
```

`@Guard` decorator takes 2 parameters.

* First is hook fuction that returns `boolean`. If hook function returns `true` - field access is allowed.
* 2nd argument is options object with error message in case field access is not allowed

## `createGuard` function

In many cases, we need to guard multiple fields with exactly the same rule. `createGuard` function helps avoiding code repetition in such case.

Let's say we have more `User` fields we want to show only to admins. We could rewrite above code with:

```ts
import { ObjectType, Field, createGuard } from 'typegql';

const OnlyAdmin = createGuard(({source, args, context}) => context.currentUser.isAdmin, {
  msg: 'Not allowed',
});

@ObjectType()
class User {
  @Field() name: string;

  @OnlyAdmin()
  @Field()
  isBanned: boolean;

  @OnlyAdmin({ msg: 'Not allowed to see this field' }) // we can overwrite guard options defined in `createGuard`
  @Field()
  hasEmailConfirmed: boolean;
}
```
