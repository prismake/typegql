# Field arguments

Many of fields in graphql queries use arguments. eg

```graphql
query {
  calculator {
    add(a: 2, b: 3)
  }
}
```

Let's create such `Calculator` object type.

```ts
import { ObjectType, Field } from 'typegql';

@ObjectType()
class Calculator {
  @Field()
  add(a: number, b: number): number {
    return a + b;
  }
}
```

Note we didn't even have to use `@Arg` decorator yet. In case of simple, scalar argument types like `string`, `number`, `boolean` it's not required. By default arguments not decorated with `@Arg` are **required**.

## Customizing argumens (eg. adding default value)

Let's say we're building another calculator metod, called `pow` which returns `base` to the `exponent` power (base^exponent). By default, we want `exponent` to be `2`.

```ts
import { ObjectType, Field, Arg } from 'typegql';

@ObjectType()
class Calculator {
  @Field()
  pow(
    base: number,
    @Arg({ nullable: true, defaultValue: 2 })
    exponent: number,
  ): number {
    return Math.pow(base, exponent);
  }
}
```

Right now `exponent` argument is optional so we can use both:

```graphql
framgnet A on Calculator {
  pow(2) # 4
}

framgnet B on Calculator {
  pow(2, 5) # 32
}
```
