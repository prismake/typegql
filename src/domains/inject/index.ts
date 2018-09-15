import { injectorRegistry, InjectorResolver } from './registry'
export {
  injectorRegistry,
  InjectorsIndex,
  InjectorResolver,
  InjectorResolverData,
} from './registry'

export function Inject(resolver: InjectorResolver): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    injectorRegistry.set(target.constructor, [fieldName, argIndex], resolver)
  }
}

export const Context = Inject(({ context }) => {
  return context
})

export const Info = Inject(({ info }) => {
  return info
})

export const Source = Inject(({ source }) => {
  return source
})
