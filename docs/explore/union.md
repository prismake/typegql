# Union types

Considering such query:

```graphql
{
  search(keyword: "car") {
    ... on Product {
      name
      price
    }
    ... on Category {
      name
      itemsCount
      avgProductPrice
    }
  }
}
```

Search field return union of `Product` and `Category`. To define such union we need to use `@Union` decorator

```ts
import { ObjectType, Field, Union } from 'typegql';

@ObjectType()
class Product {
  @Field() name: string;
  @Field() price: number;
}

@ObjectType()
class Category {
  @Field() name: string;
  @Field() itemsCount: number;
  @Field() avgProductPrice: number;
}

@Union({ types: [Product, Category] })
class SearchResult {}
```
