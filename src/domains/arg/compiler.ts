import {
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType,
  isInputType
} from 'graphql'

import { IArgsIndex, argRegistry } from './registry'

import 'reflect-metadata'

import { injectorRegistry } from '../inject/Inject'

import { Constructor, reflect } from 'typescript-rtti'
import { inferTypeFromRtti } from '../../services/utils/gql/types/inferTypeByTarget'
import { resolveType } from '../../services/utils/gql/types/typeResolvers'

export interface ICompileArgContextType {
  target: Constructor<Function>
  fieldName: string
  argumentTypes: Array<GraphQLInputType | null>
  registeredArgs: IArgsIndex
  onlyDecoratedArgs: boolean
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

  const argNames = reflect(target).getOwnMethod(fieldName).parameterNames

  if (!argNames || !argNames.length) {
    return {}
  }

  const argsMap: GraphQLFieldConfigArgumentMap = {}

  argNames.forEach((argName: string, index: number) => {
    const registeredArgConfig = registeredArgs[index]

    if (onlyDecoratedArgs && !registeredArgConfig) {
      return
    }
    const argConfig = registeredArgConfig || {}

    if (argConfig.name) {
      argName = argConfig.name
    }
    const argType = argumentTypes[index]
    if (!argType) {
      return
    }
    // don't publish args marked as auto Injected
    if (injectorRegistry.has(target, fieldName, index)) {
      return
    }

    argsMap[argName] = {
      type: argType,
      description: argConfig.description
    }
  })

  return argsMap
}

export function compileFieldArgs(
  target: Constructor<Function>,
  fieldName: string,
  onlyDecoratedArgs: boolean
): GraphQLFieldConfigArgumentMap | null {

  const getter = Object.getOwnPropertyDescriptor(
    target.prototype,
    fieldName
  )?.get

  if (getter) {
    return null
  }

  const registeredArgs = argRegistry.getAll(target)[fieldName]

  const injectedArgs = injectorRegistry.getAll(target)[fieldName]
  const reflected = reflect(target)
  const methodRtti = reflected.getOwnMethod(fieldName)
  if (!methodRtti) {
    return null
  }
  const args = methodRtti.parameterTypes

  const argumentTypes: Array<GraphQLInputType | null> = []

  for (let index = 0; index < args.length; index++) {
    const registeredArgConfig = registeredArgs && registeredArgs[index]
    if (injectedArgs && injectedArgs[index]) {
      argumentTypes[index] = null
    } else if (registeredArgConfig?.type) {
      // @ts-expect-error
      argumentTypes[index] = resolveType(registeredArgConfig.type, true, true)
    } else if (onlyDecoratedArgs && !registeredArgConfig) {
      argumentTypes[index] = null
    } else {
      const rtti = args[index]
      const inferredType = inferTypeFromRtti(rtti)
      // @ts-expect-error
      argumentTypes[index] = inferredType
      argRegistry.set(target, [fieldName, index], {
        ...registeredArgConfig,
        inferredType,
        argIndex: index
      })
    }
  }

  const compileFieldArgContext = {
    target,
    fieldName,
    argumentTypes,
    registeredArgs,
    onlyDecoratedArgs
  }

  return convertArgsArrayToArgsMap(compileFieldArgContext)
}
