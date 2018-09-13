import {
  queryFieldsRegistry,
  mutationFieldsRegistry,
  schemaRootsRegistry,
} from './registry';
import { SchemaFieldError } from './error';
import { compileFieldConfig, FieldOptions, Field } from '../field';

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

function getFieldCompiler(target: Function, fieldName: string) {
  const fieldCompiler = () => {
    requireSchemaRoot(target, fieldName);
    const compiledField = compileFieldConfig(target, fieldName);
    return compiledField;
  };

  return fieldCompiler;
}

// special fields
export function Query(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    validateRootSchemaField(targetInstance, fieldName);
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = getFieldCompiler(
      targetInstance.constructor,
      fieldName,
    );
    queryFieldsRegistry.set(
      targetInstance.constructor,
      fieldName,
      fieldCompiler,
    );
  };
}

export function Mutation(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    validateRootSchemaField(targetInstance, fieldName);
    Field(options)(targetInstance, fieldName);
    const fieldCompiler = getFieldCompiler(
      targetInstance.constructor,
      fieldName,
    );
    mutationFieldsRegistry.set(
      targetInstance.constructor,
      fieldName,
      fieldCompiler,
    );
  };
}
