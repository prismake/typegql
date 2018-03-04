import { Thunk } from 'services/types';
import { unionRegistry } from './registry';
export { unionRegistry } from './registry';

import { compileUnionType } from './compiler';

export interface UnionOptions {
  name?: string;
  types: Thunk<any[]>;
}

export function Union(config: UnionOptions): ClassDecorator {
  return target => {
    unionRegistry.set(target, () => {
      return compileUnionType(target, { name: target.name, ...config });
    });
  };
}
