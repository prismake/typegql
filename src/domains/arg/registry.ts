import { DeepWeakMap } from 'services/utils';

export interface ArgInnerConfig {
  description?: string;
  isNullable?: boolean;
  isList?: boolean;
  type?: any;
}

export const argRegistry = new DeepWeakMap<
  Function,
  ArgInnerConfig,
  {
    [fieldName: string]: ArgsIndex;
  }
>();

export interface ArgsIndex {
  [argIndex: number]: ArgInnerConfig;
}
