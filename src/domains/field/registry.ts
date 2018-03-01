import { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';
import { DeepWeakMap } from 'services/utils';
import { FieldError } from './error';

type Getter = () => GraphQLFieldConfig<any, any>;

interface AllRegisteredFields {
  [fieldName: string]: FieldInnerConfig;
}

export const fieldsRegistry = new DeepWeakMap<
  Function,
  FieldInnerConfig,
  AllRegisteredFields
>();

export interface FieldInnerConfig {
  name: string;
  property: string;
  description?: string;
  type?: any;
}

interface AllQueryFields {
  [fieldName: string]: FieldInnerConfig;
}

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  FieldInnerConfig,
  AllQueryFields
>();
