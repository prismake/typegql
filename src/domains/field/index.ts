import { fieldsRegistry, FieldInnerConfig, queryFieldsRegistry } from './registry';

export { FieldInnerConfig, fieldsRegistry, queryFieldsRegistry } from './registry';
export { compileAllFields, compileFieldConfig } from './compiler';
import { compileFieldConfig } from './compiler';
export { isQueryField } from './services';
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

    fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig);
  };
}
