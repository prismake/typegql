import { registerField } from './registry';

export {
  registerField,
  hasFieldRegistered,
  getRegisteredField,
  getAllRegisteredFields,
} from './registry';
export { compileAllFields } from './compiler';
export { FieldError } from './error';

interface FieldConfig {
  description?: string;
  type?: any;
  name?: string;
}

export function Field(options?: FieldConfig): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    registerField(targetInstance.constructor, fieldName, {
      property: fieldName,
      name: fieldName,
      ...options,
    });
  };
}
