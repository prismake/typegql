## Custom Decorators

Sometimes you might want to re-use some field or type decorator settings. Creating custom decorator might be suitable solution then.

Doing it is quite simple. You'd need to define custom function that returns call to original decorator.

Let's say we want to define custom field decorator that always has `String` type and requires field description (that originally would be optional)

```typescript
import { Schema, Query, Field, ObjectType, compileSchema } from 'typegql';

function StringWithDescription(fieldDescription: string) {
  if (!fieldDescription) {
    throw new Error(
      `Field description is required when decorated with @StringWithDescription`,
    );
  }
  return Field({
    type: String,
    description: fieldDescription,
  });
}
```

Later on, to use such `@StringWithDescription` field decorator you could simply:

```typescript
import { ObjectType } from 'typegql';

@ObjectType()
class CustomObject {
  @StringWithDescription('This is custom field') stringValue: string;
}
```
