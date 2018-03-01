Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
require("reflect-metadata");
function isParsableScalar(input) {
    return [String, Number, Boolean].includes(input);
}
exports.isParsableScalar = isParsableScalar;
function parseNativeTypeToGraphQL(input) {
    if (input === String) {
        return graphql_1.GraphQLString;
    }
    if (input === Number) {
        return graphql_1.GraphQLFloat;
    }
    if (input === Boolean) {
        return graphql_1.GraphQLBoolean;
    }
}
exports.parseNativeTypeToGraphQL = parseNativeTypeToGraphQL;
// type MetadataType = 'design:returntype' | 'design:type' | 'design:paramtypes';
function inferTypeByTarget(target, key) {
    if (!key) {
        return Reflect.getMetadata('design:type', target);
    }
    var returnType = Reflect.getMetadata('design:returntype', target, key);
    if (returnType) {
        return returnType;
    }
    var targetField = target[key];
    if (targetField && typeof targetField === 'function') {
        return Reflect.getMetadata('design:returntype', target, key);
    }
    return Reflect.getMetadata('design:type', target, key);
}
exports.inferTypeByTarget = inferTypeByTarget;
