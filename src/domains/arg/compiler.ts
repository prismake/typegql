import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType,
  isInputType,
  GraphQLNonNull
} from 'graphql'

import { IArgsIndex, argRegistry } from './registry'
import { ArgError } from './error'
import { defaultArgOptions } from './options'
import 'reflect-metadata'

import { injectorRegistry } from '../inject/Inject'

import { getParameterNames } from '../../services/utils/getParameterNames'
import { resolveType } from '../../services/utils/gql/types/typeResolvers'

function compileInferedAndRegisterdArgs(
  infered: any[],
  registeredArgs: IArgsIndex = [],
  onlyDecoratedArgs: boolean
) {
  return infered
    .map((inferedType, index) => {
      const registered = registeredArgs[index]
      if (registered && registered.type) {
        return registered.type
      }
      if (!registered && onlyDecoratedArgs) {
        return null // no need to get the type as it is not decorated
      }
      return inferedType
    })
    .map((argType) => {
      return resolveType(argType, true, true)
    })
}

export interface ICompileArgContextType {
  target: Function
  fieldName: string
  argumentTypes: GraphQLInputType[]
  registeredArgs: IArgsIndex
  onlyDecoratedArgs: boolean
}

function validateArgs(ctx: ICompileArgContextType) {
  const { target, fieldName, argumentTypes, onlyDecoratedArgs } = ctx
  argumentTypes.forEach((argType, argIndex) => {
    const isInjectedArg = injectorRegistry.has(target, fieldName, argIndex)
    const isDecorated = argRegistry.has(target, fieldName, argIndex)

    if (!isInjectedArg) {
      if (!argType) {
        if (!isDecorated && onlyDecoratedArgs) {
          return
        }
        throw new ArgError(
          ctx,
          argIndex,
          `Could not infer type of argument. Make sure to use native GraphQLInputType, native scalar like 'String' or class decorated with @InputObjectType`
        )
      }

      if (!isInputType(argType)) {
        throw new ArgError(
          ctx,
          argIndex,
          `Argument has incorrect type. Make sure to use native GraphQLInputType, native scalar like 'String' or class decorated with @InputObjectType`
        )
      }
    }

    if (isInjectedArg && isDecorated) {
      throw new ArgError(
        ctx,
        argIndex,
        `Argument cannot be marked wiht both @Arg and @Inject or custom injector`
      )
    }
  })
}

function enhanceType(originalType: GraphQLInputType, isNullable: boolean) {
  let finalType = originalType
  if (!isNullable) {
    finalType = new GraphQLNonNull(finalType)
  }
  return finalType
}

function convertArgsArrayToArgsMap({
  target,
  fieldName,
  argumentTypes,
  registeredArgs = [],
  onlyDecoratedArgs
}: ICompileArgContextType): GraphQLFieldConfigArgumentMap {
  const fieldDescriptor = Object.getOwnPropertyDescriptor(
    target.prototype,
    fieldName
  )

  // in case of getters, field arguments are not relevant
  if (!fieldDescriptor || fieldDescriptor.get) {
    return {}
  }

  const functionDefinition = target.prototype[fieldName]
  const argNames = getParameterNames(functionDefinition)

  if (!argNames || !argNames.length) {
    return {}
  }

  const argsMap: GraphQLFieldConfigArgumentMap = {}

  argNames.forEach((argName: string, index: number) => {
    const registeredArgConfig = registeredArgs[index]

    if (onlyDecoratedArgs && !registeredArgConfig) {
      return
    }
    const argConfig = registeredArgConfig || { ...defaultArgOptions }

    if (argConfig.name) {
      argName = argConfig.name
    }
    const argType: GraphQLInputType = argumentTypes[index]

    // don't publish args marked as auto Injected
    if (injectorRegistry.has(target, fieldName, index)) {
      return
    }

    const finalType = enhanceType(argType, argConfig.isNullable)

    argsMap[argName] = {
      type: finalType,
      description: argConfig.description
    }
  })

  return argsMap
}

export function compileFieldArgs(
  target: Function,
  fieldName: string,
  onlyDecoratedArgs: boolean
): GraphQLFieldConfigArgumentMap {
  const registeredArgs = argRegistry.getAll(target)[fieldName]

  let inferedRawArgs = Reflect.getMetadata(
    'design:paramtypes',
    target.prototype,
    fieldName
  )

  // There are no arguments
  if (!inferedRawArgs) {
    if (!registeredArgs) {
      return {}
    } else {
      // we didn't infer anything, but there were some registered at runtime
      inferedRawArgs = registeredArgs
    }
  }
  if (registeredArgs && inferedRawArgs.length < registeredArgs.length) {
    // we did infer some arguments, but some more were registered at runtime, so we ignore inferred
    // as we can't be sure which are which
    inferedRawArgs = registeredArgs
  }
  let argumentTypes: GraphQLInputType[]
  try {
    argumentTypes = (compileInferedAndRegisterdArgs(
      inferedRawArgs,
      registeredArgs,
      onlyDecoratedArgs
    ) as any) as GraphQLInputType[]
  } catch (err) {
    err.message = `Field ${fieldName} on ${target} failed to compile arguments: ${
      err.message
    }`
    throw err
  }

  const compileFieldArgContext = {
    target,
    fieldName,
    argumentTypes,
    registeredArgs,
    onlyDecoratedArgs
  }

  validateArgs(compileFieldArgContext)

  return convertArgsArrayToArgsMap(compileFieldArgContext)
}
