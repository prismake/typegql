Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var index_1 = require("../index");
var resolver_1 = require("./resolver");
var fieldType_1 = require("./fieldType");
var arg_1 = require("domains/arg");
function getFinalFieldType(target, fieldName, forcedType) {
    if (forcedType) {
        return fieldType_1.resolveTypeOrThrow(forcedType, target, fieldName);
    }
    return fieldType_1.inferTypeOrThrow(target, fieldName);
}
function validateResolvedType(target, fieldName, type) {
    if (!graphql_1.isOutputType(type)) {
        throw new index_1.FieldError(target, fieldName, "Validation of type failed. Resolved type for @Field must be GraphQLOutputType.");
    }
    return true;
}
function compileFieldConfig(target, fieldName) {
    var _a = index_1.fieldsRegistry.get(target, fieldName), type = _a.type, description = _a.description;
    var args = arg_1.compileFieldArgs(target, fieldName);
    var resolvedType = getFinalFieldType(target, fieldName, type);
    if (!validateResolvedType(target, fieldName, resolvedType)) {
        return;
    }
    return {
        description: description,
        type: resolvedType,
        resolve: resolver_1.compileFieldResolver(target, fieldName),
        args: args,
    };
}
exports.compileFieldConfig = compileFieldConfig;
function compileAllFields(target) {
    var fields = index_1.fieldsRegistry.getAll(target);
    var finalFieldsMap = {};
    Object.keys(fields).forEach(function (fieldName) {
        var config = index_1.fieldsRegistry.get(target, fieldName);
        finalFieldsMap[config.name] = compileFieldConfig(target, fieldName);
    });
    return finalFieldsMap;
}
exports.compileAllFields = compileAllFields;
