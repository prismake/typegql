# Complex input types with `@InputObjectType` and `@InputField`

Sometimes we need arguments to have complex structure (eg. user have some todos and want to delete few of them using filter) like

```graphql
query {
  currentUser {
    deleteManyTodos(where: { isDone: true, nameContains: "call my friend" }) {
      deletedCount
    }
  }
}
```

Let's create such `User` type that allows complex `where` argument for `deleteManyTodos` field.

```ts
import { ObjectType, Field, Arg, InputObjectType } from 'typegql';

@InputObjectType()
class WhereFilter {
  @InputField({ defaultValue: true })
  isDone: boolean;
  @InputField() nameContains: string;
}

@ObjectType()
class DeleteTodosResult {
  constructor(public deletedCount: number) {}
  @Field() deletedCount: number;
}

@ObjectType()
class User {
  @Field()
  deleteManyTodos(where: WhereFilter): DeleteTodosResult {
    const deletedCount = todosService.remove(where);
    return new DeleteTodosResult(deletedCount);
  }
}
```
