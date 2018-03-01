var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("./compiler");
var registry_1 = require("./registry");
var compiler_2 = require("./compiler");
exports.compileObjectType = compiler_2.compileObjectType;
var error_1 = require("./error");
exports.ObjectTypeError = error_1.ObjectTypeError;
var registry_2 = require("./registry");
exports.objectTypeRegistry = registry_2.objectTypeRegistry;
exports.inputTypeRegistry = registry_2.inputTypeRegistry;
function ObjectType(options) {
    return function (target) {
        var config = __assign({ name: target.name }, options);
        var outputTypeCompiler = function () { return compiler_1.compileObjectTypeWithConfig(target, config); };
        registry_1.objectTypeRegistry.set(target, outputTypeCompiler);
    };
}
exports.ObjectType = ObjectType;
