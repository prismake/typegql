import { DeepWeakMap } from 'services/utils';

export interface ArgConfig {
  description?: string;
  type?: any;
}

export const argRegistry = new DeepWeakMap<
  Function,
  ArgConfig,
  {
    [fieldName: string]: ArgsIndex;
  }
>();

export interface ArgsIndex {
  [argIndex: number]: ArgConfig;
}
