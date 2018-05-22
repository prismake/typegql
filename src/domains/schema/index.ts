export {
  schemaRootsRegistry,
  mutationFieldsRegistry,
  queryFieldsRegistry,
} from './registry';
import { schemaRootsRegistry, SchemaRootConfig } from './registry';
import { showDeprecationWarning } from '~/services/utils';
// import { compileSchema } from './compiler';
export { compileSchema } from './compiler';
export { Query, Mutation } from './rootFields';

export function SchemaRoot(config: SchemaRootConfig = {}): ClassDecorator {
  return target => {
    schemaRootsRegistry.set(target, config);
  };
}

export function Schema(config: SchemaRootConfig = {}) {
  showDeprecationWarning(
    'Use @SchemaRoot instead and compile like: compileSchema({ roots: [RootA, RootB] })',
    Schema,
  );
  return SchemaRoot(config);
}
