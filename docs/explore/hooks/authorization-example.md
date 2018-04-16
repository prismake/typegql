# Authorization example with @Before hook

`@Before` hook is great for use-cases like authorization because:

* it is executed before field resolver itself
* if any of `@Before` hooks will return promise - it will be resolved before field itself is resolved
* if any of `@Before` will throw error, resolving will be instantly stopped

Very basic authorization model could look like:

```ts
import { ObjectType, Field, Before } from 'typegql';

@ObjectType()
class User {
  @Field() name: string;

  @Before(({ context }) => {
    if (!context.isUserAuthorized()) {
      throw new Error('Unauthorized to know this');
    }
  })
  @Field()
  isBanned: boolean;
}
```

In such case, we're checking graphql context before we'll allow access to field itself.

## Creating reusable hooks

Authorization like in example above is very likely to be required in many places in any graphql schema.

We could simply create custom hook that can be easily re-used:

```ts
import { ObjectType, Field, Before } from 'typegql';

function AdminOnly(errorMessage: string = 'Unauthorized') {
  return Before(({ context }) => {
    if (!context.isAdmin()) {
      throw new Error(errorMessage);
    }
  });
}

@ObjectType()
class User {
  @Field() name: string;

  @AdminOnly()
  @Field()
  isBanned: boolean;

  @AdminOnly('Only admin can see this information')
  @Field()
  isEmailConfirmed: boolean;
}
```

## Object aware authorization (eg. only I can see my email address)

Quite often access level for every given object depends on who is seeing it. Let's say we want only admin or owner of account to be able to see email address of `User`:

```ts
import { ObjectType, Field, Before } from 'typegql';

function AdminOrAccountOwner(errorMessage: string = 'Unauthorized') {
  return Before(async ({ context, source }) => {
    if (context.isCurrentUserAdmin()) {
      return; // allow for admin
    }

    // note that we can use async functions inside hooks
    if (source.id === (await context.getCurrentUserId())) {
      return; // allow if accessing user id is the same as accessed user id
    }

    throw new Error(errorMessage);
  });
}

@ObjectType()
class User {
  @Field() id: string;

  @AdminOrAccountOwner()
  @Field()
  email: string;
}
```
