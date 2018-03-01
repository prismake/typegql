Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("services/utils");
var index_1 = require("../index");
var utils_2 = require("services/utils");
function resolveTypeOrThrow(type, target, fieldName) {
    var resolvedType = utils_2.resolveType(type);
    if (!resolvedType) {
        throw new index_1.FieldError(target, fieldName, "Forced type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator");
    }
    return resolvedType;
}
exports.resolveTypeOrThrow = resolveTypeOrThrow;
function inferTypeOrThrow(target, fieldName) {
    var inferedType = utils_1.inferTypeByTarget(target.prototype, fieldName);
    if (!inferedType) {
        throw new index_1.FieldError(target, fieldName, "Could not infer return type and no type is forced. In case of circular dependencies make sure to force types of instead of infering them.");
    }
    return utils_2.resolveType(inferedType);
}
exports.inferTypeOrThrow = inferTypeOrThrow;
