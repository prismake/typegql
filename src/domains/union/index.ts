import { Thunk } from '~/services/types';
import { unionRegistry } from './registry';
export { unionRegistry } from './registry';

import { compileUnionType, UnionTypeResolver } from './compiler';

export interface UnionOptions {
  name?: string;
  resolveTypes?: UnionTypeResolver;
  types: Thunk<any[]>;
}

export function Union(config: UnionOptions): ClassDecorator {
  return target => {
    unionRegistry.set(target, () => {
      return compileUnionType(target, { name: target.name, ...config });
    });
  };
}
