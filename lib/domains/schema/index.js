Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
exports.schemaRegistry = registry_1.schemaRegistry;
var registry_2 = require("./registry");
var compiler_1 = require("./compiler");
var compiler_2 = require("./compiler");
exports.compileSchema = compiler_2.compileSchema;
var rootFields_1 = require("./rootFields");
exports.Query = rootFields_1.Query;
function Schema() {
    return function (target) {
        var compiler = function () { return compiler_1.compileSchema(target); };
        registry_2.schemaRegistry.set(target, compiler);
    };
}
exports.Schema = Schema;
