Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var utils_1 = require("services/utils");
var error_1 = require("./error");
var compileUnionCache = new WeakMap();
function getDefaultResolver(types) {
    return function (value, context, info) {
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            if (type.isTypeOf(value, context, info)) {
                return type;
            }
        }
    };
}
function compileUnionType(target, config) {
    if (compileUnionCache.has(target)) {
        return compileUnionCache.get(target);
    }
    var types = config.types, resolver = config.resolver, name = config.name;
    var resolvedTypes = utils_1.resolveTypes(types);
    for (var _i = 0, resolvedTypes_1 = resolvedTypes; _i < resolvedTypes_1.length; _i++) {
        var type = resolvedTypes_1[_i];
        if (!utils_1.isObjectType(type)) {
            throw new error_1.UnionError(target, "Every union type must be of type GraphQLObjectType. '" + type + "' is not.");
        }
    }
    var typeResolver = resolver || getDefaultResolver(resolvedTypes);
    var compiled = new graphql_1.GraphQLUnionType({
        name: name,
        resolveType: typeResolver,
        types: resolvedTypes,
    });
    compileUnionCache.set(target, compiled);
    return compiled;
}
exports.compileUnionType = compileUnionType;
