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
var compiler_1 = require("./compiler");
exports.compileFieldArgs = compiler_1.compileFieldArgs;
function Arg(options) {
    if (options === void 0) { options = {}; }
    return function (target, fieldName, argIndex) {
        // const allArgNames = getParameterNames(target);
        // const inferedArgName = allArgNames[argIndex];
        registry_1.argRegistry.set(target.constructor, [fieldName, argIndex], __assign({}, options));
    };
}
exports.Arg = Arg;
