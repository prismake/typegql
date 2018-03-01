var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var registry_2 = require("./registry");
exports.fieldsRegistry = registry_2.fieldsRegistry;
exports.queryFieldsRegistry = registry_2.queryFieldsRegistry;
var compiler_1 = require("./compiler");
exports.compileAllFields = compiler_1.compileAllFields;
exports.compileFieldConfig = compiler_1.compileFieldConfig;
var services_1 = require("./services");
exports.isQueryField = services_1.isQueryField;
var error_1 = require("./error");
exports.FieldError = error_1.FieldError;
function Field(options) {
    return function (targetInstance, fieldName) {
        var finalConfig = __assign({ property: fieldName, name: fieldName }, options);
        registry_1.fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig);
    };
}
exports.Field = Field;
