Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("services/utils");
var inject_1 = require("domains/inject");
var registry_1 = require("./registry");
var error_1 = require("./error");
var utils_2 = require("services/utils");
function compileInferedAndRegisterdArgs(infered, registeredArgs) {
    if (registeredArgs === void 0) { registeredArgs = {}; }
    var argsMerged = infered.map(function (inferedType, index) {
        var registered = registeredArgs[index];
        if (registered && registered.type) {
            return registered.type;
        }
        return inferedType;
    });
    var resolvedArgs = argsMerged.map(function (rawType, index) {
        return utils_1.resolveType(rawType);
    });
    return resolvedArgs;
}
function validateArgs(target, fieldName, types) {
    types.forEach(function (argType, argIndex) {
        var isInjectedArg = inject_1.injectorRegistry.has(target, fieldName, argIndex);
        if (!isInjectedArg && !argType) {
            throw new error_1.ArgError(target, fieldName, argIndex, "Could not infer type of argument");
        }
        if (!isInjectedArg && !graphql_1.isInputType(argType)) {
            throw new error_1.ArgError(target, fieldName, argIndex, "Argument must be of type GraphQLInputType");
        }
        if (isInjectedArg && registry_1.argRegistry.has(target, fieldName, argIndex)) {
            throw new error_1.ArgError(target, fieldName, argIndex, "Argument cannot be marked wiht both @Arg and @Inject or custom injector");
        }
    });
    return true;
}
function convertArgsArrayToArgsMap(target, fieldName, argsTypes, registeredArgs) {
    if (registeredArgs === void 0) { registeredArgs = {}; }
    var functionDefinition = target.prototype[fieldName];
    var argNames = utils_2.getParameterNames(functionDefinition);
    if (!argNames || !argNames.length) {
        return {};
    }
    var argsMap = {};
    argNames.forEach(function (argName, index) {
        var argConfig = registeredArgs[index];
        var argType = argsTypes[index];
        // don't publish args marked as auto Injected
        if (inject_1.injectorRegistry.has(target, fieldName, index)) {
            return;
        }
        argsMap[argName] = {
            type: argType,
            description: argConfig && argConfig.description,
        };
    });
    return argsMap;
}
function compileFieldArgs(target, fieldName) {
    var registeredArgs = registry_1.argRegistry.getAll(target)[fieldName];
    var inferedRawArgs = Reflect.getMetadata('design:paramtypes', target.prototype, fieldName);
    // There are no arguments
    if (!inferedRawArgs) {
        return {};
    }
    var argTypes = compileInferedAndRegisterdArgs(inferedRawArgs, registeredArgs);
    if (!validateArgs(target, fieldName, argTypes)) {
        return;
    }
    return convertArgsArrayToArgsMap(target, fieldName, argTypes, registeredArgs);
}
exports.compileFieldArgs = compileFieldArgs;
