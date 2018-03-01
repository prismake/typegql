import { Field, fieldsRegistry, compileFieldConfig } from 'domains/field';
import { SchemaError, SchemaFieldError } from './error';

import { schemaRegistry, queryFieldsRegistry } from './registry';
import { GraphQLOutputType } from 'graphql';
import { isObjectType } from 'services/utils';

interface FieldOptions {
  description?: string;
  type?: any;
  name?: string;
}

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
