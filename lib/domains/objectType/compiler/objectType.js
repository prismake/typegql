var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var index_1 = require("../index");
var field_1 = require("domains/field");
var utils_1 = require("services/utils");
var compileOutputTypeCache = new WeakMap();
function createTypeFieldsGetter(target) {
    if (field_1.fieldsRegistry.isEmpty(target)) {
        throw new index_1.ObjectTypeError(target, "There are no fields inside this type.");
    }
    return utils_1.createCachedThunk(function () {
        return field_1.compileAllFields(target);
    });
}
function compileObjectTypeWithConfig(target, config) {
    if (compileOutputTypeCache.has(target)) {
        return compileOutputTypeCache.get(target);
    }
    var compiled = new graphql_1.GraphQLObjectType(__assign({}, config, { isTypeOf: function (value) { return value instanceof target; }, fields: createTypeFieldsGetter(target) }));
    compileOutputTypeCache.set(target, compiled);
    return compiled;
}
exports.compileObjectTypeWithConfig = compileObjectTypeWithConfig;
function compileObjectType(target) {
    if (!index_1.objectTypeRegistry.has(target)) {
        throw new index_1.ObjectTypeError(target, "Class is not registered. Make sure it's decorated with @Type decorator");
    }
    var compiler = index_1.objectTypeRegistry.get(target);
    return compiler();
}
exports.compileObjectType = compileObjectType;
