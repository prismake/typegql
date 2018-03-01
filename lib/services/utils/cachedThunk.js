Object.defineProperty(exports, "__esModule", { value: true });
var cache = new WeakMap();
function createCachedThunk(thunk) {
    return function () {
        if (cache.has(thunk)) {
            return cache.get(thunk);
        }
        var result = thunk();
        cache.set(thunk, result);
        return result;
    };
}
exports.createCachedThunk = createCachedThunk;
