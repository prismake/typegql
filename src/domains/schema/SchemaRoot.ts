export {
  schemaRootsRegistry,
  mutationFieldsRegistry,
  queryFieldsRegistry
} from './registry'
import { schemaRootsRegistry } from './registry'

export { compileSchema } from './compiler'
export { isSchemaRoot, getSchemaRootInstance } from './services'

export function SchemaRoot(config: object = {}): ClassDecorator {
  return (target) => {
    schemaRootsRegistry.set(target, config)
  }
}
