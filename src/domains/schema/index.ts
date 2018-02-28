import { schemaRegistry } from './registry';
export { schemaRegistry } from './registry';
import { compileSchema } from './compiler';

import { field } from 'domains';

export function Schema(): ClassDecorator {
  return target => {};
}

export function Query(): PropertyDecorator {
  return (target, fieldName) => {
    if (!schemaRegistry.has(target)) {
      throw new Error('@Query can be only inside @Schema');
    }
    queryRegistry.set(target, () => compileObjectType());
  };
}
