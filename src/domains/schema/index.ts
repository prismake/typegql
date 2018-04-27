export {
  schemaRootsRegistry,
  mutationFieldsRegistry,
  queryFieldsRegistry,
} from './registry';
import { schemaRootsRegistry, SchemaRootConfig } from './registry';
// import { compileSchema } from './compiler';
export { compileSchema } from './compiler';
export { Query, Mutation } from './rootFields';

export function SchemaRoot(config: SchemaRootConfig = {}): ClassDecorator {
  return target => {
    schemaRootsRegistry.set(target, config);
  };
}
