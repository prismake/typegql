import {
  registerFieldAfterHook,
  registerFieldBeforeHook,
  HookExecutor,
  AfterHookExecutor
} from './registry'

export {
  fieldAfterHooksRegistry,
  fieldBeforeHooksRegistry,
  HookExecutor
} from './registry'
export { HookError } from './error'

export function Before(hook: HookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    registerFieldBeforeHook(targetInstance.constructor, fieldName, hook)
  }
}

export function After(hook: AfterHookExecutor): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    registerFieldAfterHook(targetInstance.constructor, fieldName, hook)
  }
}
