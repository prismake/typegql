import { Schema, Query, compileSchema } from 'typegql';

@Schema()
class MySchema {
  @Query()
  hello(name: string): string {
    return `hello, ${name}!`;
  }
}

export const schema = compileSchema(MySchema);
