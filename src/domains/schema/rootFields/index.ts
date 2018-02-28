import { queryRegistry, mutationRegistry } from './registry';

import { schemaRegistry } from '../index';

export function Query(): PropertyDecorator {
  return (target, fieldName) => {
    if (!schemaRegistry.has(target)) {
      throw new Error('@Query can be only inside @Schema');
    }
    queryRegistry.set(target);
  };
}
