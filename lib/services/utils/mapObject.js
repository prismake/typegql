Object.defineProperty(exports, "__esModule", { value: true });
function mapObject(input, mapper) {
    var result = {};
    Object.keys(input).map(function (key) {
        var mapped = mapper(input[key], key);
        result[key] = mapped;
    });
    return result;
}
exports.mapObject = mapObject;
function convertObjectToArray(input) {
    return Object.keys(input).map(function (key) { return input[key]; });
}
exports.convertObjectToArray = convertObjectToArray;
