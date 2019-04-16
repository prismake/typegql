import { GraphQLFieldResolver } from 'graphql'

import {
  HookExecutor,
  fieldBeforeHooksRegistry,
  fieldAfterHooksRegistry
} from '../../hooks/hooks'
import { isSchemaRoot, getSchemaRootInstance } from '../../schema/SchemaRoot'

import {
  injectorRegistry,
  InjectorResolver,
  InjectorsIndex
} from '../../inject/Inject'
import { argRegistry, IArgInnerConfig } from '../../arg/registry'
import { getParameterNames } from '../../../services/utils/getParameterNames'
import { plainToClass } from 'class-transformer'
import { isParsableScalar } from '../../../services/utils/gql/types/parseNative'

interface IArgsMap {
  [argName: string]: any
}

interface IComputeArgsOptions {
  args: IArgsMap
  reflectedParamTypes: any[] | null
  injectors: InjectorsIndex
  injectorToValueMapper: (injector: InjectorResolver) => any
  getArgConfig: (index: number) => IArgInnerConfig
}

async function performHooksExecution(
  hooks: HookExecutor[],
  source: any,
  args: any,
  context: any,
  info: any
) {
  if (!hooks) {
    return
  }
  // all hooks are executed in paralel. Resolution of the field continues after the hooks resolve all their promises
  return Promise.all(
    hooks.map((hook) => {
      return hook({ source, args, context, info })
    })
  )
}

export function computeFinalArgs(
  func: Function,
  {
    args,
    injectors,
    injectorToValueMapper,
    getArgConfig,
    reflectedParamTypes
  }: IComputeArgsOptions
) {
  const paramNames = getParameterNames(func)
  return paramNames.map((paramName, index) => {
    const argConfig = getArgConfig(index)

    if (args && args.hasOwnProperty(paramName)) {
      const argValue = args[paramName]
      const reflectedType = reflectedParamTypes && reflectedParamTypes[index]
      if (argConfig && argConfig.type) {
        if (Array.isArray(argConfig.type)) {
          const type = argConfig.type[0]
          if (!type) {
            return argValue
          }
          return argValue.map((singleArg: any) => {
            if (typeof singleArg !== 'object' || !type.prototype) {
              return singleArg
            }
            const instance = Object.create(type.prototype)
            return Object.assign(instance, singleArg)
          })
        } else {
          const { type } = argConfig
          if (typeof argValue !== 'object' || !type.prototype) {
            return argValue
          }

          const instance = Object.create(type.prototype)

          const resultingInstance = Object.assign(instance, argValue)

          return resultingInstance
        }
      } else if (reflectedType) {
        if (
          typeof reflectedType === 'function' &&
          !isParsableScalar(reflectedType)
        ) {
          const instance = Object.create(reflectedType.prototype)
          return Object.assign(instance, argValue)
        }
        return argValue
      } else {
        return argValue
      }
    }

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
  castTo?: any
): GraphQLFieldResolver<any, any> {
  const injectors = injectorRegistry.getAll(target)[fieldName]
  const beforeHooks = fieldBeforeHooksRegistry.get(target, fieldName)
  const afterHooks = fieldAfterHooksRegistry.get(target, fieldName)

  return async (
    source: any,
    args: object | null = null,
    context: any = null,
    info: any = null
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
      reflectedParamTypes: Reflect.getMetadata(
        'design:paramtypes',
        target.prototype,
        fieldName
      ),
      injectors: injectors || {},
      injectorToValueMapper: (injector) =>
        injector.apply(source, [{ source, args, context, info }]),
      getArgConfig: (index: number) => {
        const argConfig = argRegistry.get(target, [fieldName, index])
        return argConfig
      }
    })

    let result = await instanceFieldFunc.apply(source, params)

    if (castTo && result !== null && typeof result === 'object') {
      result =
        Array.isArray(castTo) && Array.isArray(result)
          ? result.map((item) => plainToClass(castTo[0], item))
          : plainToClass(castTo, result)
    }

    await performHooksExecution(afterHooks, source, args, context, info) // TODO: Consider adding resolve return to hook callback
    return result
  }
}
