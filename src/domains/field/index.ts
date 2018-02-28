import { fieldsRegistry, FieldInnerConfig } from './registry';

export { FieldInnerConfig, fieldsRegistry } from './registry';
export { compileAllFields, compileFieldConfig } from './compiler';
import { compileFieldConfig } from './compiler';
export { FieldError } from './error';

interface FieldOptions {
  description?: string;
  type?: any;
  name?: string;
}

export function Field(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    const finalConfig: FieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      ...options,
    };

    fieldsRegistry.set(targetInstance.constructor, fieldName, {
      property: fieldName,
      name: fieldName,
      ...options,
    });

    // registerField(targetInstance.constructor, fieldName, {
    //   property: fieldName,
    //   name: fieldName,
    //   ...options,
    // });
  };
}
