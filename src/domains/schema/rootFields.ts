import { Field, FieldOptions, compileFieldConfig } from 'domains/field';
import { queryFieldsRegistry } from './registry';

// special fields
export function Query(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = () => {
      const compiledField = compileFieldConfig(targetInstance.constructor, fieldName);
      compiledField.type;
      return compiledField;
    };
    queryFieldsRegistry.set(targetInstance.constructor, fieldName, fieldCompiler);
  };
}
