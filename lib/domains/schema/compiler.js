Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var registry_1 = require("./registry");
var error_1 = require("./error");
var utils_1 = require("services/utils");
function validateSchemaTarget(target) {
    if (!registry_1.schemaRegistry.has(target)) {
        throw new error_1.SchemaError(target, "Schema target must be registered with @Schema");
    }
    if (registry_1.queryFieldsRegistry.isEmpty(target)) {
        throw new error_1.SchemaError(target, "Schema must have at least one field registered with @Query");
    }
}
function validateRootFieldType(target, fieldName, type, rootFieldType) {
    if (!utils_1.isObjectType(type)) {
        throw new error_1.SchemaError(target, "Root field " + rootFieldType + "." + fieldName + " is not compiled to GraphQLObjectType. Compiled type is '" + type + "'.");
    }
}
function compileSchemaRootField(target, name, fields) {
    var compiledFields = utils_1.mapObject(fields, function (compiler, fieldName) {
        var compiledField = compiler();
        validateRootFieldType(target, fieldName, compiledField.type, name);
        return compiledField;
    });
    return new graphql_1.GraphQLObjectType({
        name: name,
        fields: compiledFields,
    });
}
function compileSchema(target) {
    validateSchemaTarget(target);
    var query = compileSchemaRootField(target, 'Query', registry_1.queryFieldsRegistry.getAll(target));
    return new graphql_1.GraphQLSchema({
        query: query,
    });
}
exports.compileSchema = compileSchema;
