import { GraphQLResolveInfo } from 'graphql';
import { DeepWeakMap } from '~/services/utils';
import { HookError } from './error';

export interface HookExecutorResolverArgs {
  source: any;
  args: { [argName: string]: any };
  context: any;
  info: GraphQLResolveInfo;
}

export type HookExecutor<Result = void> = (
  data: HookExecutorResolverArgs,
) => Result | Promise<Result>;

export interface AllRegisteredHooks {
  [fieldName: string]: HookExecutor;
}

export const fieldBeforeHooksRegistry = new DeepWeakMap<
  Function,
  HookExecutor[],
  AllRegisteredHooks
>();

export const fieldAfterHooksRegistry = new DeepWeakMap<
  Function,
  HookExecutor[],
  AllRegisteredHooks
>();

export function registerFieldBeforeHook(
  target: Function,
  fieldName: string,
  hook: HookExecutor,
) {
  if (!hook) {
    throw new HookError(
      target,
      fieldName,
      `Field @Before hook function must be supplied.`,
    );
  }
  const currentHooks = fieldBeforeHooksRegistry.get(target, fieldName) || [];
  fieldBeforeHooksRegistry.set(target, fieldName, [hook, ...currentHooks]);
}

export function registerFieldAfterHook(
  target: Function,
  fieldName: string,
  hook: HookExecutor,
) {
  if (!hook) {
    throw new HookError(
      target,
      fieldName,
      `Field @After hook function must be supplied.`,
    );
  }
  const currentHooks = fieldAfterHooksRegistry.get(target, fieldName) || [];
  fieldAfterHooksRegistry.set(target, fieldName, [hook, ...currentHooks]);
}
