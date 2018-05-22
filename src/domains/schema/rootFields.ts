import { Field, FieldOptions, compileFieldConfig } from '~/domains/field';
import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  schemaRootsRegistry,
} from './registry';
import { SchemaFieldError } from './error';

function validateRootSchemaField(targetInstance: Object, fieldName: string) {
  if (
    !(targetInstance as any)[fieldName] &&
    !targetInstance.constructor.prototype[fieldName]
  ) {
    throw new SchemaFieldError(
      targetInstance.constructor,
      fieldName,
      `Every root schema field must regular class function`,
    );
  }
}

function requireSchemaRoot(target: Function, fieldName: string) {
  if (schemaRootsRegistry.has(target)) {
    return;
  }
  throw new SchemaFieldError(
    target,
    fieldName,
    `Root field must be registered on class decorated with @Schema`,
  );
}

// special fields
export function Query(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    validateRootSchemaField(targetInstance, fieldName);
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = () => {
      requireSchemaRoot(targetInstance.constructor, fieldName);
      const compiledField = compileFieldConfig(targetInstance.constructor, fieldName);
      compiledField.type;
      return compiledField;
    };
    queryFieldsRegistry.set(targetInstance.constructor, fieldName, fieldCompiler);
  };
}

export function Mutation(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = () => {
      const compiledField = compileFieldConfig(targetInstance.constructor, fieldName);
      compiledField.type;
      return compiledField;
    };
    mutationFieldsRegistry.set(targetInstance.constructor, fieldName, fieldCompiler);
  };
}
