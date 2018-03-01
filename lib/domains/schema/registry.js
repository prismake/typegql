Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("services/utils");
exports.schemaRegistry = new WeakMap();
exports.queryFieldsRegistry = new utils_1.DeepWeakMap();
exports.mutationRegistry = new utils_1.DeepWeakMap();
