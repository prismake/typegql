Object.defineProperty(exports, "__esModule", { value: true });
var field_1 = require("domains/field");
var registry_1 = require("./registry");
// special fields
function Query(options) {
    return function (targetInstance, fieldName) {
        field_1.Field(options)(targetInstance, fieldName);
        var fieldCompiler = function () {
            var compiledField = field_1.compileFieldConfig(targetInstance.constructor, fieldName);
            compiledField.type;
            return compiledField;
        };
        registry_1.queryFieldsRegistry.set(targetInstance.constructor, fieldName, fieldCompiler);
    };
}
exports.Query = Query;
