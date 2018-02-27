import { GraphQLFieldConfigArgumentMap, GraphQLOutputType } from 'graphql';
import { resolveType } from 'services/utils';
import { hasInjectorRegistered } from 'domains/inject';
import { getAllArgs, ArgsIndex, hasArgRegistered } from './registry';
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

  return argsMerged.map((rawType, index) => {
    return resolveType(rawType);
  });
}

function validateArgs(target: Function, fieldName: string, types: GraphQLOutputType[]) {
  types.forEach((argType, argIndex) => {
    if (!hasInjectorRegistered(target, fieldName, argIndex) && !argType) {
      throw new ArgError(target, fieldName, argIndex, `Could not infer type of argument`);
    }

    if (
      hasArgRegistered(target, fieldName, argIndex) &&
      hasInjectorRegistered(target, fieldName, argIndex)
    ) {
      throw new ArgError(
        target,
        fieldName,
        argIndex,
        `Argument cannot be marked wiht both @Arg and @Inject or custom injector`,
      );
    }
  });
}

function convertArgsArrayToArgsMap(
  target: Function,
  fieldName: string,
  argsTypes: GraphQLOutputType[],
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
    if (hasInjectorRegistered(target, fieldName, index)) {
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
  const registeredArgs = getAllArgs(target, fieldName);
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

  validateArgs(target, fieldName, argTypes);

  return convertArgsArrayToArgsMap(target, fieldName, argTypes, registeredArgs);
}
