import {
  registerFieldAfterHook,
  registerFieldBeforeHook,
  HookExecutor,
} from './registry';

export {
  fieldAfterHooksRegistry,
  fieldBeforeHooksRegistry,
  HookExecutor,
} from './registry';
export { HookError } from './error';

export function Before(hook: HookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    registerFieldBeforeHook(targetInstance.constructor, fieldName, hook);
  };
}

export function After(hook: HookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    registerFieldAfterHook(targetInstance.constructor, fieldName, hook);
  };
}

export interface GuardOptions {
  msg: string;
}

export function Guard(
  guardFunction: HookExecutor<boolean>,
  options: GuardOptions,
): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    const hook: HookExecutor = async data => {
      const isAllowed = await guardFunction(data);
      if (isAllowed !== true) {
        throw new Error(options.msg);
      }
    };
    registerFieldBeforeHook(targetInstance.constructor, fieldName, hook);
  };
}

export function createGuard(guardFunction: HookExecutor<boolean>, options: GuardOptions) {
  return (guardOptions: GuardOptions = options): PropertyDecorator => {
    return Guard(guardFunction, guardOptions);
  };
}
