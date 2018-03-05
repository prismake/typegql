export { schemaRegistry, mutationFieldsRegistry, queryFieldsRegistry } from './registry';
import { schemaRegistry } from './registry';
import { compileSchema } from './compiler';
export { compileSchema } from './compiler';
export { Query, Mutation } from './rootFields';

export function Schema(): ClassDecorator {
  return target => {
    const compiler = () => compileSchema(target);
    schemaRegistry.set(target, compiler);
  };
}
