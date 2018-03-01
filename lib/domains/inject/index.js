Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var registry_2 = require("./registry");
exports.injectorRegistry = registry_2.injectorRegistry;
function Inject(resolver) {
    return function (target, fieldName, argIndex) {
        registry_1.injectorRegistry.set(target.constructor, [fieldName, argIndex], resolver);
    };
}
exports.Inject = Inject;
exports.Context = Inject(function (source, args, context, info) {
    return context;
});
exports.Info = Inject(function (source, args, context, info) {
    return info;
});
exports.Source = Inject(function (source, args, context, info) {
    return source;
});
