import {
  GraphQLFieldConfigArgumentMap,
  GraphQLType,
  GraphQLInputType,
  isInputType,
  GraphQLNonNull,
} from 'graphql';
import { resolveType } from 'services/utils';
import { injectorRegistry } from 'domains/inject';
import { ArgsIndex, argRegistry } from './registry';
import { ArgError } from './error';
import { getParameterNames } from 'services/utils';

function compileInferedAndRegisterdArgs(infered: any[], registeredArgs: ArgsIndex = {}) {
  const argsMerged = infered.map((inferedType, index) => {
    const registered = registeredArgs[index];
    if (registered && registered.type) {
      return registered.type;
    }
    return inferedType;
  });

  const resolvedArgs = argsMerged.map((rawType, index) => {
    return resolveType(rawType);
  });

  return resolvedArgs;
}

function validateArgs(
  target: Function,
  fieldName: string,
  types: GraphQLType[],
): types is GraphQLInputType[] {
  types.forEach((argType, argIndex) => {
    const isInjectedArg = injectorRegistry.has(target, fieldName, argIndex);

    if (!isInjectedArg && !argType) {
      throw new ArgError(target, fieldName, argIndex, `Could not infer type of argument`);
    }

    if (!isInjectedArg && !isInputType(argType)) {
      throw new ArgError(
        target,
        fieldName,
        argIndex,
        `Argument must be of type GraphQLInputType`,
      );
    }

    if (isInjectedArg && argRegistry.has(target, fieldName, argIndex)) {
      throw new ArgError(
        target,
        fieldName,
        argIndex,
        `Argument cannot be marked wiht both @Arg and @Inject or custom injector`,
      );
    }
  });
  return true;
}

function convertArgsArrayToArgsMap(
  target: Function,
  fieldName: string,
  argsTypes: GraphQLInputType[],
  registeredArgs: ArgsIndex = {},
): GraphQLFieldConfigArgumentMap {
  const functionDefinition = target.prototype[fieldName];
  const argNames = getParameterNames(functionDefinition);

  if (!argNames || !argNames.length) {
    return {};
  }

  const argsMap: GraphQLFieldConfigArgumentMap = {};
  argNames.forEach((argName, index) => {
    const argConfig = registeredArgs[index];
    const argType = argsTypes[index];

    // don't publish args marked as auto Injected
    if (injectorRegistry.has(target, fieldName, index)) {
      return;
    }

    argsMap[argName] = {
      type: argType,
      description: argConfig && argConfig.description,
    };
  });
  return argsMap;
}

export function compileFieldArgs(
  target: Function,
  fieldName: string,
): GraphQLFieldConfigArgumentMap {
  const registeredArgs = argRegistry.getAll(target)[fieldName];
  const inferedRawArgs = Reflect.getMetadata(
    'design:paramtypes',
    target.prototype,
    fieldName,
  );

  // There are no arguments
  if (!inferedRawArgs) {
    return {};
  }

  const argTypes = compileInferedAndRegisterdArgs(inferedRawArgs, registeredArgs);

  if (!validateArgs(target, fieldName, argTypes)) {
    return;
  }

  return convertArgsArrayToArgsMap(target, fieldName, argTypes, registeredArgs);
}
