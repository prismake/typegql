import { GraphQLFieldConfig } from 'graphql';
import { DeepWeakMap } from 'services/utils';
import { FieldError } from './error';

type Getter = () => GraphQLFieldConfig<any, any>;

interface AllFields {
  [fieldName: string]: FieldInnerConfig;
}

export const fieldsRegistry = new DeepWeakMap<Function, FieldInnerConfig, AllFields>();

export interface FieldInnerConfig {
  name: string;
  property: string;
  description?: string;
  type?: any;
}
