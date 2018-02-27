import { GraphQLFieldResolver } from 'graphql';
import { getRegisteredField } from '../index';

import { getAllInjectors, InjectorsIndex, InjectorResolver } from 'domains/inject';

import { getParameterNames } from 'services/utils';

interface ArgsMap {
  [argName: string]: any;
}

interface ComputeArgsOptions {
  args: ArgsMap;
  injectors: InjectorsIndex;
  injectorToValueMapper: (injector: InjectorResolver) => any;
}

function computeFinalArgs(
  func: Function,
  { args, injectors, injectorToValueMapper }: ComputeArgsOptions,
) {
  const paramNames = getParameterNames(func);
  return paramNames.map((paramName, index) => {
    if (args[paramName]) {
      return args[paramName];
    }

    const injector = injectors[index];

    if (!injector) {
      return null;
    }

    return injectorToValueMapper(injector);
  });
}

export function compileFieldResolver(
  target: Function,
  fieldName: string,
): GraphQLFieldResolver<any, any> {
  const config = getRegisteredField(target, fieldName);
  const injectors = getAllInjectors(target, fieldName);
  const propertyName = config.property;

  return async (source: any, args = null, context = null, info = null) => {
    const instanceField = source[propertyName];

    if (typeof instanceField !== 'function') {
      return instanceField;
    }

    const instanceFieldFunc = instanceField as Function;
    const params = computeFinalArgs(instanceFieldFunc, {
      args: args || {},
      injectors,
      injectorToValueMapper: injector =>
        injector.apply(source, [source, args, context, info]),
    });

    return await instanceFieldFunc.apply(source, params);
  };
}
