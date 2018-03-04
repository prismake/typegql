# Enums

For enums we can work with native Typescript enum keyword like

```ts
enum TaskType {
  Done,
  InProgress,
  Finished,
  Cancelled,
}
```

The only thing is required is registering such enum with it's name, so schema compiler is aware of it (as under the hood, enum is plain key-value object).

```ts
import { registerEnum } from 'typegql';

enum TaskType {
  Done,
  InProgress,
  Finished,
  Cancelled,
}

registerEnum(TaskType, { name: 'TaskType' });
```

Now, to use such enum in query like:

```graphql
query {
  currentUser {
    hasAnyTaskOfType(type: Done)
  }
}
```

`User` type would be defined as:

```ts
import { ObjectType, Field, registerEnum } from 'typegql';

enum TaskType {
  Done,
  InProgress,
  Finished,
  Cancelled,
}

registerEnum(TaskType, { name: 'TaskType' });

@ObjectType()
class User {
  @Field() id: number;

  @Field()
  hasAnyTaskOfType(type: TaskType): boolean {
    return tasksService.hasTasksOfType(type);
  }
}
```
