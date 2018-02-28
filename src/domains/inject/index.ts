import { InjectorResolver, injectorRegistry } from './registry';
export { injectorRegistry, InjectorsIndex, InjectorResolver } from './registry';

export function Inject(resolver: InjectorResolver): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    injectorRegistry.set(target.constructor, [fieldName, argIndex], resolver);
  };
}

export const Context = Inject((source, args, context, info) => {
  return context;
});

export const Info = Inject((source, args, context, info) => {
  return info;
});

export const Source = Inject((source, args, context, info) => {
  return source;
});
