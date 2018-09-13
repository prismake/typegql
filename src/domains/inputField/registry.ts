import { DeepWeakMap } from '../../services/utils';

export interface AllRegisteredInputFields {
  [fieldName: string]: FieldInputInnerConfig;
}

export const inputFieldsRegistry = new DeepWeakMap<
  Function,
  FieldInputInnerConfig,
  AllRegisteredInputFields
>();

export interface FieldInputInnerConfig {
  name: string;
  defaultValue?: any;
  property: string;
  description?: string;
  type?: any;
  isNullable?: boolean;
}
