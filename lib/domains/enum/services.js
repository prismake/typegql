Object.defineProperty(exports, "__esModule", { value: true });
function convertNativeEnumToGraphQLEnumValues(enumDef) {
    var valueConfigMap = {};
    Object.keys(enumDef).map(function (key) {
        if (!isNaN(key)) {
            return;
        }
        var value = enumDef[key];
        valueConfigMap[key] = {
            value: value,
        };
    });
    return valueConfigMap;
}
exports.convertNativeEnumToGraphQLEnumValues = convertNativeEnumToGraphQLEnumValues;
