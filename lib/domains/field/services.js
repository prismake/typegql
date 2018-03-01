Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
function isQueryField(target, fieldName) {
    var fieldRegistered = registry_1.fieldsRegistry.get(target, fieldName);
    var queryFieldRegistered = registry_1.queryFieldsRegistry.get(target, fieldName);
    return fieldRegistered && fieldRegistered === queryFieldRegistered;
}
exports.isQueryField = isQueryField;
