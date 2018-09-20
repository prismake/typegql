import { GraphQLFieldResolver } from 'graphql'

import {
  HookExecutor,
  fieldBeforeHooksRegistry,
  fieldAfterHooksRegistry,
} from '../../hooks'
import { isSchemaRoot, getSchemaRootInstance } from '../../schema'

import { getParameterNames } from '../../../services/utils'
import {
  injectorRegistry,
  InjectorResolver,
  InjectorsIndex,
} from '../../inject'
import { argRegistry, ArgInnerConfig } from '../../arg/registry'

interface ArgsMap {
  [argName: string]: any
}

interface ComputeArgsOptions {
  args: ArgsMap
  injectors: InjectorsIndex
  injectorToValueMapper: (injector: InjectorResolver) => any
  getArgConfig: (index: number) => ArgInnerConfig
}

async function performHooksExecution(
  hooks: HookExecutor[],
  source: any,
  args: any,
  context: any,
  info: any,
) {
  if (!hooks) {
    return
  }
  // all hooks are executed in parrell instead of sequence. We wait for them all to be resolved before we continue
  return await Promise.all(
    hooks.map((hook) => {
      return hook({ source, args, context, info })
    }),
  )
}

function computeFinalArgs(
  func: Function,
  { args, injectors, injectorToValueMapper, getArgConfig }: ComputeArgsOptions,
) {
  const paramNames = getParameterNames(func)
  return paramNames.map((paramName, index) => {
    if (args && args.hasOwnProperty(paramName)) {
      return args[paramName]
    }

    const argConfig = getArgConfig(index)
    if (argConfig) {
      return args[argConfig.name]
    }

    const injector = injectors[index]

    if (!injector) {
      return undefined
    }

    return injectorToValueMapper(injector)
  })
}

function getFieldOfTarget(instance: any, prototype: any, fieldName: string) {
  if (!instance) {
    return prototype[fieldName]
  }

  const instanceField = instance[fieldName]

  if (instanceField !== undefined) {
    return instanceField
  }

  return prototype[fieldName]
}

export function compileFieldResolver(
  target: Function,
  fieldName: string,
): GraphQLFieldResolver<any, any> {
  const injectors = injectorRegistry.getAll(target)[fieldName]
  const beforeHooks = fieldBeforeHooksRegistry.get(target, fieldName)
  const afterHooks = fieldAfterHooksRegistry.get(target, fieldName)

  return async (
    source: any,
    args: object | null = null,
    context: any = null,
    info: any = null,
  ) => {
    if (isSchemaRoot(target)) {
      source = getSchemaRootInstance(target)
    }

    await performHooksExecution(beforeHooks, source, args, context, info)
    const instanceField = getFieldOfTarget(source, target.prototype, fieldName)

    if (typeof instanceField !== 'function') {
      await performHooksExecution(afterHooks, source, args, context, info)
      return instanceField
    }

    const instanceFieldFunc = instanceField as Function

    const params = computeFinalArgs(instanceFieldFunc, {
      args: args || {},
      injectors: injectors || {},
      injectorToValueMapper: (injector) =>
        injector.apply(source, [{ source, args, context, info }]),
      getArgConfig: (index: number) => {
        return argRegistry.get(target, [fieldName, index])
      },
    })

    const result = await instanceFieldFunc.apply(source, params)

    await performHooksExecution(afterHooks, source, args, context, info) // TODO: Consider adding resolve return to hook callback
    return result
  }
}
