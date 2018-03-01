Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var error_1 = require("./error");
var registry_1 = require("./registry");
var registry_2 = require("./registry");
exports.enumsRegistry = registry_2.enumsRegistry;
var services_1 = require("./services");
function registerEnum(enumDef, options) {
    if (typeof options === 'string') {
        options = { name: options };
    }
    var name = options.name, description = options.description;
    if (registry_1.enumsRegistry.has(enumDef)) {
        throw new error_1.EnumError(name, "Enum is already registered");
    }
    var values = services_1.convertNativeEnumToGraphQLEnumValues(enumDef);
    var enumType = new graphql_1.GraphQLEnumType({
        name: name,
        description: description,
        values: values,
    });
    registry_1.enumsRegistry.set(enumDef, enumType);
    return enumType;
}
exports.registerEnum = registerEnum;
