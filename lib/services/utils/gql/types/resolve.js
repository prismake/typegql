Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var domains_1 = require("domains");
var domains_2 = require("domains");
var parseNative_1 = require("./parseNative");
function resolveType(input, allowThunk) {
    if (allowThunk === void 0) { allowThunk = true; }
    if (graphql_1.isType(input)) {
        return input;
    }
    if (parseNative_1.isParsableScalar(input)) {
        return parseNative_1.parseNativeTypeToGraphQL(input);
    }
    if (domains_2.enumsRegistry.has(input)) {
        return domains_2.enumsRegistry.get(input);
    }
    if (domains_2.unionRegistry.has(input)) {
        return domains_2.unionRegistry.get(input)();
    }
    if (domains_1.objectTypeRegistry.has(input)) {
        return domains_1.compileObjectType(input);
    }
    if (!allowThunk || typeof input !== 'function') {
        return;
    }
    return resolveType(input(), false);
}
exports.resolveType = resolveType;
function resolveTypes(types) {
    if (Array.isArray(types)) {
        return types.map(function (type) {
            return resolveType(type);
        });
    }
    return types().map(function (type) {
        return resolveType(type);
    });
}
exports.resolveTypes = resolveTypes;
