import { GraphQLFieldResolver } from 'graphql';
import { InjectorsIndex, InjectorResolver, injectorRegistry } from 'domains/inject';
import {
  fieldAfterHooksRegistry,
  fieldBeforeHooksRegistry,
  HookExecutor,
} from 'domains/hooks';
import { getParameterNames } from 'services/utils';

interface ArgsMap {
  [argName: string]: any;
}

interface ComputeArgsOptions {
  args: ArgsMap;
  injectors: InjectorsIndex;
  injectorToValueMapper: (injector: InjectorResolver) => any;
}

async function performHooksExecution(
  instance: any,
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
      return hook.call(instance, { source, args, context, info });
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

export function compileFieldResolver(
  target: Function,
  fieldName: string,
): GraphQLFieldResolver<any, any> {
  // const config = fieldsRegistry.get(target, fieldName);
  const injectors = injectorRegistry.getAll(target)[fieldName];
  const beforeHooks = fieldBeforeHooksRegistry.get(target, fieldName);
  const afterHooks = fieldAfterHooksRegistry.get(target, fieldName);

  return async (source: any, args = null, context = null, info = null) => {
    
    let instance, instanceField;
    if (source && source[fieldName]) {
      instance = source;
      instanceField = source[fieldName];
    } else if (target.prototype[fieldName]) {
      instance = new (target as any);
      instanceField = target.prototype[fieldName];
    }

    await performHooksExecution(instance, beforeHooks, source, args, context, info);

    if (typeof instanceField !== 'function') {
      await performHooksExecution(instance, afterHooks, source, args, context, info);
      return instanceField;
    }

    const instanceFieldFunc = instanceField as Function;
    const params = computeFinalArgs(instanceFieldFunc, {
      args: args || {},
      injectors: injectors || {},
      injectorToValueMapper: injector =>
        injector.apply(source, [{ source, args, context, info }]),
    });

    const result = await instanceFieldFunc.apply(instance, params);

    await performHooksExecution(instance, afterHooks, source, args, context, info); // TODO: Consider adding resolve return to hook callback
    return result;
  };
}
