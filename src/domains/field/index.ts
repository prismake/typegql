import { fieldsRegistry, FieldInnerConfig } from './registry';

export { FieldInnerConfig, fieldsRegistry, queryFieldsRegistry } from './registry';
export { compileAllFields, compileFieldConfig } from './compiler';
export { isQueryField } from './services';
export { FieldError } from './error';

export interface FieldOptions {
  description?: string;
  type?: any;
  name?: string;
  isNullable?: boolean;
  isList?: boolean;
}

export function Field(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    const finalConfig: FieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      isList: false,
      isNullable: true,
      ...options,
    };

    fieldsRegistry.set(targetInstance.constructor, fieldName, {
      ...finalConfig,
    });
  };
}
