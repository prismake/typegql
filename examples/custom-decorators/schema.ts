import { Schema, Query, Field, ObjectType, compileSchema } from 'typegql';

function StringWithDescription(additionalDescription: string) {
  return Field({
    type: String,
    description: `This is custom field. Additional description: ${additionalDescription}`,
  });
}

function ExplicitNameObjectType(name: string) {
  if (!name) {
    throw new Error(
      `Classes decorated with @ExplicitNameObjectType require explicit name instead of one guessed from class name.`,
    );
  }
  return ObjectType({ name });
}

@ExplicitNameObjectType('MyTypeName')
class CustomObject {
  @StringWithDescription('This is custom field') stringValue: string;
}

@Schema()
class MySchema {
  @Query()
  getCustomObject(stringValue: string): CustomObject {
    const object = new CustomObject();
    object.stringValue = stringValue;
    return object;
  }
}

export const schema = compileSchema(MySchema);
