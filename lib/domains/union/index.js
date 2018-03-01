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
exports.unionRegistry = registry_2.unionRegistry;
var compiler_1 = require("./compiler");
function Union(config) {
    return function (target) {
        registry_1.unionRegistry.set(target, function () {
            return compiler_1.compileUnionType(target, __assign({ name: target.name }, config));
        });
    };
}
exports.Union = Union;
