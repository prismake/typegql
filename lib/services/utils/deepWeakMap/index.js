Object.defineProperty(exports, "__esModule", { value: true });
var objectPath = require("object-path");
function flattenPaths(paths) {
    return paths.reduce(function (accumulatedPath, nextPath) {
        if (Array.isArray(nextPath)) {
            return accumulatedPath.concat(nextPath.map(function (pathPart) { return "" + pathPart; }));
        }
        return accumulatedPath.concat(["" + nextPath]);
    }, []);
}
var DeepWeakMap = /** @class */ (function () {
    function DeepWeakMap() {
        this.map = new WeakMap();
    }
    DeepWeakMap.prototype.isEmpty = function (target) {
        return !Object.keys(this.getAll(target)).length;
    };
    DeepWeakMap.prototype.getAll = function (target) {
        var map = this.map;
        if (!map.has(target)) {
            map.set(target, {});
        }
        return map.get(target);
    };
    DeepWeakMap.prototype.set = function (target, path, value) {
        objectPath.set(this.getAll(target), path, value);
    };
    DeepWeakMap.prototype.get = function (target) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        var path = flattenPaths(paths);
        return objectPath.get(this.getAll(target), path);
    };
    DeepWeakMap.prototype.has = function (target) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        var path = flattenPaths(paths);
        return !!this.get(target, path);
    };
    return DeepWeakMap;
}());
exports.DeepWeakMap = DeepWeakMap;
