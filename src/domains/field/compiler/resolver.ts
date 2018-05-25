import { GraphQLFieldResolver } from 'graphql';
import {
  InjectorsIndex,
  InjectorResolver,
  injectorRegistry,
} from '~/domains/inject';
import {
  fieldAfterHooksRegistry,
  fieldBeforeHooksRegistry,
  HookExecutor,
} from '~/domains/hooks';
import { getParameterNames } from '~/services/utils';

interface ArgsMap {
  [argName: string]: any;
}

interface ComputeArgsOptions {
  args: ArgsMap;
  injectors: InjectorsIndex;
  injectorToValueMapper: (injector: InjectorResolver) => any;
}

async function performHooksExecution(
  hooks: HookExecutor[],
  source: any,
  args: any,
  context: any,
  info: any,
) {
  if (!hooks) {
    return;
  }
  // all hooks are executed in parrell instead of sequence. We wait for them all to be resolved before we continue
  return await Promise.all(
    hooks.map(hook => {
      return hook({ source, args, context, info });
    }),
  );
}

function computeFinalArgs(
  func: Function,
  { args, injectors, injectorToValueMapper }: ComputeArgsOptions,
) {
  const paramNames = getParameterNames(func);
  return paramNames.map((paramName, index) => {
    if (args && args[paramName]) {
      return args[paramName];
    }

    const injector = injectors[index];

    if (!injector) {
      return null;
    }

    return injectorToValueMapper(injector);
  });
}

function getFieldOfTarget(instance: any, prototype: any, fieldName: string) {
  if (!instance) {
    return prototype[fieldName];
  }

  const instanceField = instance[fieldName];

  if (instanceField !== undefined) {
    return instanceField
  }

  return prototype[fieldName];
}

export function compileFieldResolver(
  target: Function,
  fieldName: string,
): GraphQLFieldResolver<any, any> {
  // const config = fieldsRegistry.get(target, fieldName);
  const injectors = injectorRegistry.getAll(target)[fieldName];
  const beforeHooks = fieldBeforeHooksRegistry.get(target, fieldName);
  const afterHooks = fieldAfterHooksRegistry.get(target, fieldName);

  return async (source: any, args = null, context = null, info = null) => {
    await performHooksExecution(beforeHooks, source, args, context, info);
    const instanceField = getFieldOfTarget(source, target.prototype, fieldName);

    if (typeof instanceField !== 'function') {
      await performHooksExecution(afterHooks, source, args, context, info);
      return instanceField;
    }

    const instanceFieldFunc = instanceField as Function;
    const params = computeFinalArgs(instanceFieldFunc, {
      args: args || {},
      injectors: injectors || {},
      injectorToValueMapper: injector =>
        injector.apply(source, [{ source, args, context, info }]),
    });

    const result = await instanceFieldFunc.apply(source, params);

    await performHooksExecution(afterHooks, source, args, context, info); // TODO: Consider adding resolve return to hook callback
    return result;
  };
}
