import { ObjectTypeError } from './error';

export const typeConfigRegistry = new WeakMap<Function, TypeConfig>();

export interface TypeConfig {
  name: string;
  description: string;
  isNonNull?: boolean;
  isList?: boolean;
}
