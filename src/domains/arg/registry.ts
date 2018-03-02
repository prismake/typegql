import { DeepWeakMap } from 'services/utils';

export interface ArgInnerConfig {
  description?: string;
  nullable?: boolean;
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
