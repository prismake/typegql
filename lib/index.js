var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("index", ["require", "exports", "./domains"], function (require, exports, domains_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Arg = domains_1.Arg;
    exports.Field = domains_1.Field;
    exports.Info = domains_1.Info;
    exports.Schema = domains_1.Schema;
    exports.Context = domains_1.Context;
    exports.ObjectType = domains_1.ObjectType;
    exports.Query = domains_1.Query;
    exports.Union = domains_1.Union;
    exports.Inject = domains_1.Inject;
    exports.compileSchema = domains_1.compileSchema;
    exports.Source = domains_1.Source;
});
define("domains/index", ["require", "exports", "./objectType", "./field", "./arg", "./inject", "./enum", "./union", "./schema"], function (require, exports, objectType_1, field_1, arg_1, inject_1, enum_1, union_1, schema_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectType = objectType_1.ObjectType;
    exports.compileObjectType = objectType_1.compileObjectType;
    exports.objectTypeRegistry = objectType_1.objectTypeRegistry;
    exports.Field = field_1.Field;
    exports.Arg = arg_1.Arg;
    exports.Inject = inject_1.Inject;
    exports.Context = inject_1.Context;
    exports.Source = inject_1.Source;
    exports.Info = inject_1.Info;
    exports.registerEnum = enum_1.registerEnum;
    exports.enumsRegistry = enum_1.enumsRegistry;
    exports.Union = union_1.Union;
    exports.unionRegistry = union_1.unionRegistry;
    exports.Schema = schema_1.Schema;
    exports.schemaRegistry = schema_1.schemaRegistry;
    exports.compileSchema = schema_1.compileSchema;
    exports.Query = schema_1.Query;
});
define("domains/arg/registry", ["require", "exports", "services/utils"], function (require, exports, utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.argRegistry = new utils_1.DeepWeakMap();
});
define("services/error", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseError = /** @class */ (function (_super) {
        __extends(BaseError, _super);
        function BaseError(msg) {
            var _this = _super.call(this, msg) || this;
            _this.message = msg;
            return _this;
        }
        return BaseError;
    }(Error));
    exports.BaseError = BaseError;
});
define("domains/arg/error", ["require", "exports", "services/error", "services/utils"], function (require, exports, error_1, utils_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgError = /** @class */ (function (_super) {
        __extends(ArgError, _super);
        function ArgError(target, fieldName, argIndex, msg) {
            var _this = this;
            var paramNames = utils_2.getParameterNames(target.prototype[fieldName]);
            var paramName = paramNames[argIndex];
            var fullMsg = "@Type " + target.name + "." + fieldName + "(" + paramName + " <-------): " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return ArgError;
    }(error_1.BaseError));
    exports.ArgError = ArgError;
});
define("domains/arg/compiler", ["require", "exports", "graphql", "services/utils", "domains/inject", "domains/arg/registry", "domains/arg/error", "services/utils"], function (require, exports, graphql_1, utils_3, inject_2, registry_1, error_2, utils_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function compileInferedAndRegisterdArgs(infered, registeredArgs) {
        if (registeredArgs === void 0) { registeredArgs = {}; }
        var argsMerged = infered.map(function (inferedType, index) {
            var registered = registeredArgs[index];
            if (registered && registered.type) {
                return registered.type;
            }
            return inferedType;
        });
        var resolvedArgs = argsMerged.map(function (rawType, index) {
            return utils_3.resolveType(rawType);
        });
        return resolvedArgs;
    }
    function validateArgs(target, fieldName, types) {
        types.forEach(function (argType, argIndex) {
            var isInjectedArg = inject_2.injectorRegistry.has(target, fieldName, argIndex);
            if (!isInjectedArg && !argType) {
                throw new error_2.ArgError(target, fieldName, argIndex, "Could not infer type of argument");
            }
            if (!isInjectedArg && !graphql_1.isInputType(argType)) {
                throw new error_2.ArgError(target, fieldName, argIndex, "Argument must be of type GraphQLInputType");
            }
            if (isInjectedArg && registry_1.argRegistry.has(target, fieldName, argIndex)) {
                throw new error_2.ArgError(target, fieldName, argIndex, "Argument cannot be marked wiht both @Arg and @Inject or custom injector");
            }
        });
        return true;
    }
    function convertArgsArrayToArgsMap(target, fieldName, argsTypes, registeredArgs) {
        if (registeredArgs === void 0) { registeredArgs = {}; }
        var functionDefinition = target.prototype[fieldName];
        var argNames = utils_4.getParameterNames(functionDefinition);
        if (!argNames || !argNames.length) {
            return {};
        }
        var argsMap = {};
        argNames.forEach(function (argName, index) {
            var argConfig = registeredArgs[index];
            var argType = argsTypes[index];
            // don't publish args marked as auto Injected
            if (inject_2.injectorRegistry.has(target, fieldName, index)) {
                return;
            }
            argsMap[argName] = {
                type: argType,
                description: argConfig && argConfig.description,
            };
        });
        return argsMap;
    }
    function compileFieldArgs(target, fieldName) {
        var registeredArgs = registry_1.argRegistry.getAll(target)[fieldName];
        var inferedRawArgs = Reflect.getMetadata('design:paramtypes', target.prototype, fieldName);
        // There are no arguments
        if (!inferedRawArgs) {
            return {};
        }
        var argTypes = compileInferedAndRegisterdArgs(inferedRawArgs, registeredArgs);
        if (!validateArgs(target, fieldName, argTypes)) {
            return;
        }
        return convertArgsArrayToArgsMap(target, fieldName, argTypes, registeredArgs);
    }
    exports.compileFieldArgs = compileFieldArgs;
});
define("domains/arg/index", ["require", "exports", "domains/arg/registry", "domains/arg/compiler"], function (require, exports, registry_2, compiler_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileFieldArgs = compiler_1.compileFieldArgs;
    function Arg(options) {
        if (options === void 0) { options = {}; }
        return function (target, fieldName, argIndex) {
            // const allArgNames = getParameterNames(target);
            // const inferedArgName = allArgNames[argIndex];
            registry_2.argRegistry.set(target.constructor, [fieldName, argIndex], __assign({}, options));
        };
    }
    exports.Arg = Arg;
});
define("domains/enum/error", ["require", "exports", "services/error"], function (require, exports, error_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnumError = /** @class */ (function (_super) {
        __extends(EnumError, _super);
        function EnumError(name, msg) {
            var _this = this;
            var fullMsg = "Enum " + name + ": " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return EnumError;
    }(error_3.BaseError));
    exports.EnumError = EnumError;
});
define("domains/enum/registry", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.enumsRegistry = new WeakMap();
});
define("domains/enum/services", ["require", "exports"], function (require, exports) {
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
});
define("domains/enum/index", ["require", "exports", "graphql", "domains/enum/error", "domains/enum/registry", "domains/enum/registry", "domains/enum/services"], function (require, exports, graphql_2, error_4, registry_3, registry_4, services_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.enumsRegistry = registry_4.enumsRegistry;
    function registerEnum(enumDef, options) {
        if (typeof options === 'string') {
            options = { name: options };
        }
        var name = options.name, description = options.description;
        if (registry_3.enumsRegistry.has(enumDef)) {
            throw new error_4.EnumError(name, "Enum is already registered");
        }
        var values = services_1.convertNativeEnumToGraphQLEnumValues(enumDef);
        var enumType = new graphql_2.GraphQLEnumType({
            name: name,
            description: description,
            values: values,
        });
        registry_3.enumsRegistry.set(enumDef, enumType);
        return enumType;
    }
    exports.registerEnum = registerEnum;
});
define("domains/field/error", ["require", "exports", "services/error"], function (require, exports, error_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var FieldError = /** @class */ (function (_super) {
        __extends(FieldError, _super);
        function FieldError(target, fieldName, msg) {
            var _this = this;
            var fullMsg = "@Type " + target.name + "." + fieldName + ": " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return FieldError;
    }(error_5.BaseError));
    exports.FieldError = FieldError;
});
define("domains/field/registry", ["require", "exports", "services/utils"], function (require, exports, utils_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fieldsRegistry = new utils_5.DeepWeakMap();
    exports.queryFieldsRegistry = new utils_5.DeepWeakMap();
});
define("domains/field/services", ["require", "exports", "domains/field/registry"], function (require, exports, registry_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function isQueryField(target, fieldName) {
        var fieldRegistered = registry_5.fieldsRegistry.get(target, fieldName);
        var queryFieldRegistered = registry_5.queryFieldsRegistry.get(target, fieldName);
        return fieldRegistered && fieldRegistered === queryFieldRegistered;
    }
    exports.isQueryField = isQueryField;
});
define("domains/field/index", ["require", "exports", "domains/field/registry", "domains/field/registry", "./compiler", "domains/field/services", "domains/field/error"], function (require, exports, registry_6, registry_7, compiler_2, services_2, error_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fieldsRegistry = registry_7.fieldsRegistry;
    exports.queryFieldsRegistry = registry_7.queryFieldsRegistry;
    exports.compileAllFields = compiler_2.compileAllFields;
    exports.compileFieldConfig = compiler_2.compileFieldConfig;
    exports.isQueryField = services_2.isQueryField;
    exports.FieldError = error_6.FieldError;
    function Field(options) {
        return function (targetInstance, fieldName) {
            var finalConfig = __assign({ property: fieldName, name: fieldName }, options);
            registry_6.fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig);
        };
    }
    exports.Field = Field;
});
define("domains/field/compiler/fieldType", ["require", "exports", "services/utils", "domains/field/index", "services/utils"], function (require, exports, utils_6, index_1, utils_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function resolveTypeOrThrow(type, target, fieldName) {
        var resolvedType = utils_7.resolveType(type);
        if (!resolvedType) {
            throw new index_1.FieldError(target, fieldName, "Forced type is incorrect. Make sure to use either native graphql type or class that is registered with @Type decorator");
        }
        return resolvedType;
    }
    exports.resolveTypeOrThrow = resolveTypeOrThrow;
    function inferTypeOrThrow(target, fieldName) {
        var inferedType = utils_6.inferTypeByTarget(target.prototype, fieldName);
        if (!inferedType) {
            throw new index_1.FieldError(target, fieldName, "Could not infer return type and no type is forced. In case of circular dependencies make sure to force types of instead of infering them.");
        }
        return utils_7.resolveType(inferedType);
    }
    exports.inferTypeOrThrow = inferTypeOrThrow;
});
define("domains/field/compiler/resolver", ["require", "exports", "domains/inject", "services/utils"], function (require, exports, inject_3, utils_8) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function computeFinalArgs(func, _a) {
        var args = _a.args, injectors = _a.injectors, injectorToValueMapper = _a.injectorToValueMapper;
        var paramNames = utils_8.getParameterNames(func);
        return paramNames.map(function (paramName, index) {
            if (args && args[paramName]) {
                return args[paramName];
            }
            var injector = injectors[index];
            if (!injector) {
                return null;
            }
            return injectorToValueMapper(injector);
        });
    }
    function compileFieldResolver(target, fieldName) {
        var _this = this;
        // const config = fieldsRegistry.get(target, fieldName);
        var injectors = inject_3.injectorRegistry.getAll(target)[fieldName];
        return function (source, args, context, info) {
            if (args === void 0) { args = null; }
            if (context === void 0) { context = null; }
            if (info === void 0) { info = null; }
            return __awaiter(_this, void 0, void 0, function () {
                var instanceField, instanceFieldFunc, params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            instanceField = (source && source[fieldName]) || target.prototype[fieldName];
                            if (typeof instanceField !== 'function') {
                                return [2 /*return*/, instanceField];
                            }
                            instanceFieldFunc = instanceField;
                            params = computeFinalArgs(instanceFieldFunc, {
                                args: args || {},
                                injectors: injectors || {},
                                injectorToValueMapper: function (injector) {
                                    return injector.apply(source, [source, args, context, info]);
                                },
                            });
                            return [4 /*yield*/, instanceFieldFunc.apply(source, params)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
    }
    exports.compileFieldResolver = compileFieldResolver;
});
define("domains/field/compiler/index", ["require", "exports", "graphql", "domains/field/index", "domains/field/compiler/resolver", "domains/field/compiler/fieldType", "domains/arg"], function (require, exports, graphql_3, index_2, resolver_1, fieldType_1, arg_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getFinalFieldType(target, fieldName, forcedType) {
        if (forcedType) {
            return fieldType_1.resolveTypeOrThrow(forcedType, target, fieldName);
        }
        return fieldType_1.inferTypeOrThrow(target, fieldName);
    }
    function validateResolvedType(target, fieldName, type) {
        if (!graphql_3.isOutputType(type)) {
            throw new index_2.FieldError(target, fieldName, "Validation of type failed. Resolved type for @Field must be GraphQLOutputType.");
        }
        return true;
    }
    function compileFieldConfig(target, fieldName) {
        var _a = index_2.fieldsRegistry.get(target, fieldName), type = _a.type, description = _a.description;
        var args = arg_2.compileFieldArgs(target, fieldName);
        var resolvedType = getFinalFieldType(target, fieldName, type);
        if (!validateResolvedType(target, fieldName, resolvedType)) {
            return;
        }
        return {
            description: description,
            type: resolvedType,
            resolve: resolver_1.compileFieldResolver(target, fieldName),
            args: args,
        };
    }
    exports.compileFieldConfig = compileFieldConfig;
    function compileAllFields(target) {
        var fields = index_2.fieldsRegistry.getAll(target);
        var finalFieldsMap = {};
        Object.keys(fields).forEach(function (fieldName) {
            var config = index_2.fieldsRegistry.get(target, fieldName);
            finalFieldsMap[config.name] = compileFieldConfig(target, fieldName);
        });
        return finalFieldsMap;
    }
    exports.compileAllFields = compileAllFields;
});
define("domains/inject/registry", ["require", "exports", "services/utils"], function (require, exports, utils_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.injectorRegistry = new utils_9.DeepWeakMap();
});
define("domains/inject/index", ["require", "exports", "domains/inject/registry", "domains/inject/registry"], function (require, exports, registry_8, registry_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.injectorRegistry = registry_9.injectorRegistry;
    function Inject(resolver) {
        return function (target, fieldName, argIndex) {
            registry_8.injectorRegistry.set(target.constructor, [fieldName, argIndex], resolver);
        };
    }
    exports.Inject = Inject;
    exports.Context = Inject(function (source, args, context, info) {
        return context;
    });
    exports.Info = Inject(function (source, args, context, info) {
        return info;
    });
    exports.Source = Inject(function (source, args, context, info) {
        return source;
    });
});
define("domains/objectType/error", ["require", "exports", "services/error"], function (require, exports, error_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectTypeError = /** @class */ (function (_super) {
        __extends(ObjectTypeError, _super);
        function ObjectTypeError(target, msg) {
            var _this = this;
            var fullMsg = "@Type '" + target.name + "': " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return ObjectTypeError;
    }(error_7.BaseError));
    exports.ObjectTypeError = ObjectTypeError;
});
define("domains/objectType/registry", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.objectTypeRegistry = new WeakMap();
    exports.inputTypeRegistry = new WeakMap();
});
define("domains/objectType/index", ["require", "exports", "./compiler", "domains/objectType/registry", "./compiler", "domains/objectType/error", "domains/objectType/registry"], function (require, exports, compiler_3, registry_10, compiler_4, error_8, registry_11) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileObjectType = compiler_4.compileObjectType;
    exports.ObjectTypeError = error_8.ObjectTypeError;
    exports.objectTypeRegistry = registry_11.objectTypeRegistry;
    exports.inputTypeRegistry = registry_11.inputTypeRegistry;
    function ObjectType(options) {
        return function (target) {
            var config = __assign({ name: target.name }, options);
            var outputTypeCompiler = function () { return compiler_3.compileObjectTypeWithConfig(target, config); };
            registry_10.objectTypeRegistry.set(target, outputTypeCompiler);
        };
    }
    exports.ObjectType = ObjectType;
});
define("domains/objectType/compiler/objectType", ["require", "exports", "graphql", "domains/objectType/index", "domains/field", "services/utils"], function (require, exports, graphql_4, index_3, field_2, utils_10) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var compileOutputTypeCache = new WeakMap();
    function createTypeFieldsGetter(target) {
        if (field_2.fieldsRegistry.isEmpty(target)) {
            throw new index_3.ObjectTypeError(target, "There are no fields inside this type.");
        }
        return utils_10.createCachedThunk(function () {
            return field_2.compileAllFields(target);
        });
    }
    function compileObjectTypeWithConfig(target, config) {
        if (compileOutputTypeCache.has(target)) {
            return compileOutputTypeCache.get(target);
        }
        var compiled = new graphql_4.GraphQLObjectType(__assign({}, config, { isTypeOf: function (value) { return value instanceof target; }, fields: createTypeFieldsGetter(target) }));
        compileOutputTypeCache.set(target, compiled);
        return compiled;
    }
    exports.compileObjectTypeWithConfig = compileObjectTypeWithConfig;
    function compileObjectType(target) {
        if (!index_3.objectTypeRegistry.has(target)) {
            throw new index_3.ObjectTypeError(target, "Class is not registered. Make sure it's decorated with @Type decorator");
        }
        var compiler = index_3.objectTypeRegistry.get(target);
        return compiler();
    }
    exports.compileObjectType = compileObjectType;
});
define("domains/objectType/compiler/index", ["require", "exports", "domains/objectType/compiler/objectType"], function (require, exports, objectType_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileObjectType = objectType_2.compileObjectType;
    exports.compileObjectTypeWithConfig = objectType_2.compileObjectTypeWithConfig;
});
define("domains/schema/registry", ["require", "exports", "services/utils"], function (require, exports, utils_11) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.schemaRegistry = new WeakMap();
    exports.queryFieldsRegistry = new utils_11.DeepWeakMap();
    exports.mutationRegistry = new utils_11.DeepWeakMap();
});
define("domains/schema/error", ["require", "exports", "services/error"], function (require, exports, error_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SchemaError = /** @class */ (function (_super) {
        __extends(SchemaError, _super);
        function SchemaError(target, msg) {
            var _this = this;
            var fullMsg = "@Schema " + target.name + ": " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return SchemaError;
    }(error_9.BaseError));
    exports.SchemaError = SchemaError;
    var SchemaFieldError = /** @class */ (function (_super) {
        __extends(SchemaFieldError, _super);
        function SchemaFieldError(target, fieldName, msg) {
            var _this = this;
            var fullMsg = "@Schema " + target.name + "." + fieldName + ": " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return SchemaFieldError;
    }(error_9.BaseError));
    exports.SchemaFieldError = SchemaFieldError;
});
define("domains/schema/compiler", ["require", "exports", "graphql", "domains/schema/registry", "domains/schema/error", "services/utils"], function (require, exports, graphql_5, registry_12, error_10, utils_12) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function validateSchemaTarget(target) {
        if (!registry_12.schemaRegistry.has(target)) {
            throw new error_10.SchemaError(target, "Schema target must be registered with @Schema");
        }
        if (registry_12.queryFieldsRegistry.isEmpty(target)) {
            throw new error_10.SchemaError(target, "Schema must have at least one field registered with @Query");
        }
    }
    function validateRootFieldType(target, fieldName, type, rootFieldType) {
        if (!utils_12.isObjectType(type)) {
            throw new error_10.SchemaError(target, "Root field " + rootFieldType + "." + fieldName + " is not compiled to GraphQLObjectType. Compiled type is '" + type + "'.");
        }
    }
    function compileSchemaRootField(target, name, fields) {
        var compiledFields = utils_12.mapObject(fields, function (compiler, fieldName) {
            var compiledField = compiler();
            validateRootFieldType(target, fieldName, compiledField.type, name);
            return compiledField;
        });
        return new graphql_5.GraphQLObjectType({
            name: name,
            fields: compiledFields,
        });
    }
    function compileSchema(target) {
        validateSchemaTarget(target);
        var query = compileSchemaRootField(target, 'Query', registry_12.queryFieldsRegistry.getAll(target));
        return new graphql_5.GraphQLSchema({
            query: query,
        });
    }
    exports.compileSchema = compileSchema;
});
define("domains/schema/rootFields", ["require", "exports", "domains/field", "domains/schema/registry"], function (require, exports, field_3, registry_13) {
    Object.defineProperty(exports, "__esModule", { value: true });
    // special fields
    function Query(options) {
        return function (targetInstance, fieldName) {
            field_3.Field(options)(targetInstance, fieldName);
            var fieldCompiler = function () {
                var compiledField = field_3.compileFieldConfig(targetInstance.constructor, fieldName);
                compiledField.type;
                return compiledField;
            };
            registry_13.queryFieldsRegistry.set(targetInstance.constructor, fieldName, fieldCompiler);
        };
    }
    exports.Query = Query;
});
define("domains/schema/index", ["require", "exports", "domains/schema/registry", "domains/schema/registry", "domains/schema/compiler", "domains/schema/compiler", "domains/schema/rootFields"], function (require, exports, registry_14, registry_15, compiler_5, compiler_6, rootFields_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.schemaRegistry = registry_14.schemaRegistry;
    exports.compileSchema = compiler_6.compileSchema;
    exports.Query = rootFields_1.Query;
    function Schema() {
        return function (target) {
            var compiler = function () { return compiler_5.compileSchema(target); };
            registry_15.schemaRegistry.set(target, compiler);
        };
    }
    exports.Schema = Schema;
});
define("domains/union/error", ["require", "exports", "services/error"], function (require, exports, error_11) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnionError = /** @class */ (function (_super) {
        __extends(UnionError, _super);
        function UnionError(target, msg) {
            var _this = this;
            var fullMsg = "@Union '" + target.name + "': " + msg;
            _this = _super.call(this, fullMsg) || this;
            _this.message = fullMsg;
            return _this;
        }
        return UnionError;
    }(error_11.BaseError));
    exports.UnionError = UnionError;
});
define("domains/union/compiler", ["require", "exports", "graphql", "services/utils", "domains/union/error"], function (require, exports, graphql_6, utils_13, error_12) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var compileUnionCache = new WeakMap();
    function getDefaultResolver(types) {
        return function (value, context, info) {
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                if (type.isTypeOf(value, context, info)) {
                    return type;
                }
            }
        };
    }
    function compileUnionType(target, config) {
        if (compileUnionCache.has(target)) {
            return compileUnionCache.get(target);
        }
        var types = config.types, resolver = config.resolver, name = config.name;
        var resolvedTypes = utils_13.resolveTypes(types);
        for (var _i = 0, resolvedTypes_1 = resolvedTypes; _i < resolvedTypes_1.length; _i++) {
            var type = resolvedTypes_1[_i];
            if (!utils_13.isObjectType(type)) {
                throw new error_12.UnionError(target, "Every union type must be of type GraphQLObjectType. '" + type + "' is not.");
            }
        }
        var typeResolver = resolver || getDefaultResolver(resolvedTypes);
        var compiled = new graphql_6.GraphQLUnionType({
            name: name,
            resolveType: typeResolver,
            types: resolvedTypes,
        });
        compileUnionCache.set(target, compiled);
        return compiled;
    }
    exports.compileUnionType = compileUnionType;
});
define("domains/union/registry", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unionRegistry = new WeakMap();
});
define("domains/union/index", ["require", "exports", "domains/union/registry", "domains/union/registry", "domains/union/compiler"], function (require, exports, registry_16, registry_17, compiler_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unionRegistry = registry_17.unionRegistry;
    function Union(config) {
        return function (target) {
            registry_16.unionRegistry.set(target, function () {
                return compiler_7.compileUnionType(target, __assign({ name: target.name }, config));
            });
        };
    }
    exports.Union = Union;
});
define("services/types/index", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("services/utils/cachedThunk", ["require", "exports"], function (require, exports) {
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
});
define("services/utils/getParameterNames", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    var DEFAULT_PARAMS = /=[^,]+/gm;
    var FAT_ARROWS = /=>.*$/gm;
    function getParameterNames(fn) {
        var code = fn
            .toString()
            .replace(COMMENTS, '')
            .replace(FAT_ARROWS, '')
            .replace(DEFAULT_PARAMS, '');
        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
        return result === null ? [] : result;
    }
    exports.getParameterNames = getParameterNames;
});
define("services/utils/mapObject", ["require", "exports"], function (require, exports) {
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
});
define("services/utils/index", ["require", "exports", "services/utils/mapObject", "services/utils/cachedThunk", "services/utils/getParameterNames", "./deepWeakMap", "./gql"], function (require, exports, mapObject_1, cachedThunk_1, getParameterNames_1, deepWeakMap_1, gql_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mapObject = mapObject_1.mapObject;
    exports.convertObjectToArray = mapObject_1.convertObjectToArray;
    exports.createCachedThunk = cachedThunk_1.createCachedThunk;
    exports.getParameterNames = getParameterNames_1.getParameterNames;
    exports.DeepWeakMap = deepWeakMap_1.DeepWeakMap;
    exports.parseNativeTypeToGraphQL = gql_1.parseNativeTypeToGraphQL;
    exports.inferTypeByTarget = gql_1.inferTypeByTarget;
    exports.resolveType = gql_1.resolveType;
    exports.resolveTypes = gql_1.resolveTypes;
    exports.isObjectType = gql_1.isObjectType;
});
define("services/utils/deepWeakMap/index", ["require", "exports", "object-path"], function (require, exports, objectPath) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("services/utils/gql/validators", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function isObjectType(input) {
        return typeof input.getFields === 'function'; // TODO: More precise
    }
    exports.isObjectType = isObjectType;
});
define("services/utils/gql/index", ["require", "exports", "./types", "services/utils/gql/validators"], function (require, exports, types_2, validators_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseNativeTypeToGraphQL = types_2.parseNativeTypeToGraphQL;
    exports.inferTypeByTarget = types_2.inferTypeByTarget;
    exports.resolveType = types_2.resolveType;
    exports.resolveTypes = types_2.resolveTypes;
    exports.isObjectType = validators_1.isObjectType;
});
define("services/utils/gql/types/parseNative", ["require", "exports", "graphql", "reflect-metadata"], function (require, exports, graphql_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function isParsableScalar(input) {
        return [String, Number, Boolean].includes(input);
    }
    exports.isParsableScalar = isParsableScalar;
    function parseNativeTypeToGraphQL(input) {
        if (input === String) {
            return graphql_7.GraphQLString;
        }
        if (input === Number) {
            return graphql_7.GraphQLFloat;
        }
        if (input === Boolean) {
            return graphql_7.GraphQLBoolean;
        }
    }
    exports.parseNativeTypeToGraphQL = parseNativeTypeToGraphQL;
    // type MetadataType = 'design:returntype' | 'design:type' | 'design:paramtypes';
    function inferTypeByTarget(target, key) {
        if (!key) {
            return Reflect.getMetadata('design:type', target);
        }
        var returnType = Reflect.getMetadata('design:returntype', target, key);
        if (returnType) {
            return returnType;
        }
        var targetField = target[key];
        if (targetField && typeof targetField === 'function') {
            return Reflect.getMetadata('design:returntype', target, key);
        }
        return Reflect.getMetadata('design:type', target, key);
    }
    exports.inferTypeByTarget = inferTypeByTarget;
});
define("services/utils/gql/types/resolve", ["require", "exports", "graphql", "domains", "domains", "services/utils/gql/types/parseNative"], function (require, exports, graphql_8, domains_2, domains_3, parseNative_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function resolveType(input, allowThunk) {
        if (allowThunk === void 0) { allowThunk = true; }
        if (graphql_8.isType(input)) {
            return input;
        }
        if (parseNative_1.isParsableScalar(input)) {
            return parseNative_1.parseNativeTypeToGraphQL(input);
        }
        if (domains_3.enumsRegistry.has(input)) {
            return domains_3.enumsRegistry.get(input);
        }
        if (domains_3.unionRegistry.has(input)) {
            return domains_3.unionRegistry.get(input)();
        }
        if (domains_2.objectTypeRegistry.has(input)) {
            return domains_2.compileObjectType(input);
        }
        if (!allowThunk || typeof input !== 'function') {
            return;
        }
        return resolveType(input(), false);
    }
    exports.resolveType = resolveType;
    function resolveTypes(types) {
        if (Array.isArray(types)) {
            return types.map(function (type) {
                return resolveType(type);
            });
        }
        return types().map(function (type) {
            return resolveType(type);
        });
    }
    exports.resolveTypes = resolveTypes;
});
define("services/utils/gql/types/index", ["require", "exports", "services/utils/gql/types/parseNative", "services/utils/gql/types/resolve"], function (require, exports, parseNative_2, resolve_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseNativeTypeToGraphQL = parseNative_2.parseNativeTypeToGraphQL;
    exports.inferTypeByTarget = parseNative_2.inferTypeByTarget;
    exports.resolveType = resolve_1.resolveType;
    exports.resolveTypes = resolve_1.resolveTypes;
});
define("test/setup", ["require", "exports", "reflect-metadata"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("test/arg/basics.spec", ["require", "exports", "graphql", "domains"], function (require, exports, graphql_9, domains_4) {
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Arguments with @Arg', function () {
        it('Allows setting argument with @Arg decorator', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo.prototype.bar = function (baz) {
                    return baz;
                };
                __decorate([
                    domains_4.Field(),
                    __param(0, domains_4.Arg()),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_4.ObjectType()
                ], Foo);
                return Foo;
            }());
            var bar = domains_4.compileObjectType(Foo).getFields().bar;
            expect(bar.args.length).toEqual(1);
            var bazArg = bar.args[0];
            expect(bazArg.type).toBe(graphql_9.GraphQLString);
            expect(bazArg.name).toBe('baz');
        });
        it('Allows setting custom @Arg description', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo.prototype.bar = function (baz) {
                    return baz;
                };
                __decorate([
                    domains_4.Field(),
                    __param(0, domains_4.Arg({ description: 'test' })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_4.ObjectType()
                ], Foo);
                return Foo;
            }());
            var bazArg = domains_4.compileObjectType(Foo).getFields().bar.args[0];
            expect(bazArg.description).toBe('test');
        });
        it('Is passing argument value to resolver properly and in proper order', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, resolvedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                            }
                            Foo.prototype.bar = function (aaa, zzz) {
                                return aaa + "." + zzz;
                            };
                            __decorate([
                                domains_4.Field(),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String, String]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_4.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_4.compileObjectType(Foo).getFields().bar;
                        return [4 /*yield*/, bar.resolve(new Foo(), { zzz: 'zzz', aaa: 'aaa' }, null, null)];
                    case 1:
                        resolvedValue = _a.sent();
                        expect(resolvedValue).toEqual('aaa.zzz');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Is properly passing `this` argument', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, resolvedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.instanceVar = 'instance';
                            }
                            Foo.prototype.bar = function (param) {
                                return this.instanceVar + "." + param;
                            };
                            __decorate([
                                domains_4.Field(),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_4.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_4.compileObjectType(Foo).getFields().bar;
                        return [4 /*yield*/, bar.resolve(new Foo(), { param: 'param' }, null, null)];
                    case 1:
                        resolvedValue = _a.sent();
                        expect(resolvedValue).toEqual('instance.param');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Is properly passing `this` default values', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, resolvedValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.instanceVar = 'instance';
                                this.bar = this.instanceVar;
                            }
                            __decorate([
                                domains_4.Field(),
                                __metadata("design:type", String)
                            ], Foo.prototype, "bar", void 0);
                            Foo = __decorate([
                                domains_4.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_4.compileObjectType(Foo).getFields().bar;
                        return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                    case 1:
                        resolvedValue = _a.sent();
                        expect(resolvedValue).toEqual('instance');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
define("test/arg/infering.spec", ["require", "exports", "graphql", "domains"], function (require, exports, graphql_10, domains_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Arguments', function () {
        it('Infers basic arguments without @Arg decorator', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo.prototype.bar = function (baz) {
                    return baz;
                };
                __decorate([
                    domains_5.Field(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_5.ObjectType()
                ], Foo);
                return Foo;
            }());
            var bar = domains_5.compileObjectType(Foo).getFields().bar;
            expect(bar.args.length).toBeGreaterThan(0);
            var bazArg = bar.args[0];
            expect(bazArg.type).toBe(graphql_10.GraphQLString);
            expect(bazArg.name).toBe('baz');
        });
        it('Throws if is not able to infer arguemtn type without @Arg decorator', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo.prototype.bar = function (baz) {
                    return baz;
                };
                __decorate([
                    domains_5.Field(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_5.ObjectType()
                ], Foo);
                return Foo;
            }());
            expect(function () { return domains_5.compileObjectType(Foo).getFields(); }).toThrowErrorMatchingSnapshot();
        });
        it('Infers multiple basic arguments without @Arg decorator', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo.prototype.bar = function (baz, boo) {
                    return baz;
                };
                __decorate([
                    domains_5.Field(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, Number]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_5.ObjectType()
                ], Foo);
                return Foo;
            }());
            var bar = domains_5.compileObjectType(Foo).getFields().bar;
            expect(bar.args.length).toEqual(2);
            var _a = bar.args, bazArg = _a[0], booArg = _a[1];
            expect(bazArg.type).toBe(graphql_10.GraphQLString);
            expect(bazArg.name).toBe('baz');
            expect(booArg.name).toBe('boo');
            expect(booArg.type).toBe(graphql_10.GraphQLFloat);
        });
    });
});
define("test/enum/index.spec", ["require", "exports", "domains", "services/utils"], function (require, exports, domains_6, utils_14) {
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Enums', function () {
        it('Registers returns proper enum type', function () {
            var Foo;
            (function (Foo) {
                Foo[Foo["Bar"] = 0] = "Bar";
                Foo[Foo["Baz"] = 1] = "Baz";
            })(Foo || (Foo = {}));
            var enumType = domains_6.registerEnum(Foo, 'Foo');
            expect(enumType.name).toEqual('Foo');
            expect(enumType.getValues().length).toEqual(2);
            expect(enumType.getValues()[0].name).toEqual('Bar');
            expect(enumType.getValues()[0].value).toEqual(0);
        });
        it('Registers returns proper enum type with string based enums', function () {
            var Foo;
            (function (Foo) {
                Foo["Bar"] = "Test";
                Foo["Baz"] = "Test2";
            })(Foo || (Foo = {}));
            var enumType = domains_6.registerEnum(Foo, 'Foo');
            expect(enumType.name).toEqual('Foo');
            expect(enumType.getValues().length).toEqual(2);
            expect(enumType.getValues()[1].name).toEqual('Baz');
            expect(enumType.getValues()[1].value).toEqual('Test2');
        });
        it('Throw when registering the same enum twice', function () {
            var Foo;
            (function (Foo) {
                Foo["Bar"] = "Test";
                Foo["Baz"] = "Test2";
            })(Foo || (Foo = {}));
            domains_6.registerEnum(Foo, { name: 'Foo' });
            expect(function () { return domains_6.registerEnum(Foo, { name: 'Foo2' }); }).toThrowErrorMatchingSnapshot();
        });
        it('Will properly resolve registered enum', function () {
            var Foo;
            (function (Foo) {
                Foo["Bar"] = "Test";
                Foo["Baz"] = "Test2";
            })(Foo || (Foo = {}));
            var enumType = domains_6.registerEnum(Foo, { name: 'Foo' });
            expect(utils_14.resolveType(Foo)).toEqual(enumType);
        });
    });
});
define("test/field/index.spec", ["require", "exports", "graphql", "domains", "reflect-metadata"], function (require, exports, graphql_11, domains_7) {
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Field', function () {
        it('Resolves fields with default value', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, compiled, barField, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.bar = 'baz';
                            }
                            __decorate([
                                domains_7.Field(),
                                __metadata("design:type", String)
                            ], Foo.prototype, "bar", void 0);
                            Foo = __decorate([
                                domains_7.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        compiled = domains_7.compileObjectType(Foo);
                        barField = compiled.getFields().bar;
                        _a = expect;
                        return [4 /*yield*/, barField.resolve(new Foo(), {}, null, null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('baz');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Resolves fields with function resolver', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, compiled, barField, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                            }
                            Foo.prototype.bar = function () {
                                return 'baz';
                            };
                            __decorate([
                                domains_7.Field(),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", []),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_7.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        compiled = domains_7.compileObjectType(Foo);
                        barField = compiled.getFields().bar;
                        _a = expect;
                        return [4 /*yield*/, barField.resolve(new Foo(), {}, null, null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('baz');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Handles description', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                    this.bar = 'baz';
                }
                __decorate([
                    domains_7.Field({ description: 'test' }),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            expect(domains_7.compileObjectType(Foo).getFields().bar.description).toEqual('test');
        });
        it('Handles custom name', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, compiled, bazField, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.bar = 'test';
                            }
                            __decorate([
                                domains_7.Field({ name: 'baz', description: 'test' }),
                                __metadata("design:type", String)
                            ], Foo.prototype, "bar", void 0);
                            Foo = __decorate([
                                domains_7.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        compiled = domains_7.compileObjectType(Foo);
                        bazField = compiled.getFields().baz;
                        expect(compiled.getFields().bar).toBeFalsy();
                        expect(bazField).toBeTruthy();
                        expect(bazField.description).toEqual('test');
                        _a = expect;
                        return [4 /*yield*/, bazField.resolve(new Foo(), {}, null, null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBe('test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Properly infers basic scalar types', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                    this.coo = false;
                }
                Foo.prototype.boo = function () {
                    return true;
                };
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Number)
                ], Foo.prototype, "baz", void 0);
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Boolean)
                ], Foo.prototype, "foo", void 0);
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Boolean)
                ], Foo.prototype, "coo", void 0);
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", Boolean)
                ], Foo.prototype, "boo", null);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            var _a = domains_7.compileObjectType(Foo).getFields(), bar = _a.bar, baz = _a.baz, foo = _a.foo, boo = _a.boo, coo = _a.coo;
            expect(bar.type).toEqual(graphql_11.GraphQLString);
            expect(baz.type).toEqual(graphql_11.GraphQLFloat);
            expect(foo.type).toEqual(graphql_11.GraphQLBoolean);
            expect(boo.type).toEqual(graphql_11.GraphQLBoolean);
            expect(coo.type).toEqual(graphql_11.GraphQLBoolean);
        });
        it('Properly sets forced field type', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_7.Field({ type: function () { return graphql_11.GraphQLFloat; } }),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            var bar = domains_7.compileObjectType(Foo).getFields().bar;
            expect(bar.type).toEqual(graphql_11.GraphQLFloat);
        });
        it('Supports references to other types', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", String)
                ], Foo.prototype, "foo", void 0);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            var Bar = /** @class */ (function () {
                function Bar() {
                }
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Foo)
                ], Bar.prototype, "foo", void 0);
                Bar = __decorate([
                    domains_7.ObjectType()
                ], Bar);
                return Bar;
            }());
            var foo = domains_7.compileObjectType(Bar).getFields().foo;
            var compiledFoo = domains_7.compileObjectType(Foo);
            expect(foo.type).toBe(compiledFoo);
        });
        it('Supports references to itself', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_7.Field(),
                    __metadata("design:type", Foo)
                ], Foo.prototype, "fooNested", void 0);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            var fooNested = domains_7.compileObjectType(Foo).getFields().fooNested;
            expect(fooNested.type).toBe(domains_7.compileObjectType(Foo));
        });
        it('Supports circular references', function () {
            var Car = /** @class */ (function () {
                function Car() {
                }
                __decorate([
                    domains_7.Field({ type: function () { return Owner; } }),
                    __metadata("design:type", Owner)
                ], Car.prototype, "owner", void 0);
                Car = __decorate([
                    domains_7.ObjectType()
                ], Car);
                return Car;
            }());
            var Owner = /** @class */ (function () {
                function Owner() {
                }
                __decorate([
                    domains_7.Field({ type: function () { return Car; } }),
                    __metadata("design:type", Car)
                ], Owner.prototype, "car", void 0);
                Owner = __decorate([
                    domains_7.ObjectType()
                ], Owner);
                return Owner;
            }());
            // console.log({ Car, Owner });
            var owner = domains_7.compileObjectType(Car).getFields().owner;
            var car = domains_7.compileObjectType(Owner).getFields().car;
            // console.log({ owner, car });
            expect(owner.type).toBe(domains_7.compileObjectType(Owner));
            expect(car.type).toBe(domains_7.compileObjectType(Car));
        });
        it('Throws if pointing to unregistered type', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                return Foo;
            }());
            var Bar = /** @class */ (function () {
                function Bar() {
                }
                __decorate([
                    domains_7.Field({ type: function () { return Foo; } }),
                    __metadata("design:type", Foo)
                ], Bar.prototype, "foo", void 0);
                Bar = __decorate([
                    domains_7.ObjectType()
                ], Bar);
                return Bar;
            }());
            expect(function () { return domains_7.compileObjectType(Bar).getFields(); }).toThrowErrorMatchingSnapshot();
        });
        it('Properly resolves native scalar types', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_7.Field({ type: function () { return String; } }),
                    __metadata("design:type", Object)
                ], Foo.prototype, "bar", void 0);
                __decorate([
                    domains_7.Field({ type: function () { return Number; } }),
                    __metadata("design:type", Object)
                ], Foo.prototype, "baz", void 0);
                Foo = __decorate([
                    domains_7.ObjectType()
                ], Foo);
                return Foo;
            }());
            var _a = domains_7.compileObjectType(Foo).getFields(), bar = _a.bar, baz = _a.baz;
            expect(bar.type).toBe(graphql_11.GraphQLString);
            expect(baz.type).toBe(graphql_11.GraphQLFloat);
        });
    });
});
define("test/field/special-fields.spec", ["require", "exports", "domains"], function (require, exports, domains_8) {
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Special fields - @Query, @Mutation @Subscribe', function () {
        it('Will not allow registering special type on type that is not @Schema', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_8.Query(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_8.ObjectType()
                ], Foo);
                return Foo;
            }());
            Foo;
        });
    });
});
define("test/inject/index.spec", ["require", "exports", "domains", "../utils"], function (require, exports, domains_9, utils_15) {
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('@Inject', function () {
        it('Properly injects any value', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                            }
                            Foo.prototype.bar = function (test) {
                                return test;
                            };
                            __decorate([
                                domains_9.Field(),
                                __param(0, domains_9.Inject(function () { return 'baz'; })),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_9.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_9.compileObjectType(Foo).getFields().bar;
                        return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual('baz');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Makes injected argument not visible in arguments list', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar;
            return __generator(this, function (_a) {
                Foo = /** @class */ (function () {
                    function Foo() {
                    }
                    Foo.prototype.bar = function (test) {
                        return test;
                    };
                    __decorate([
                        domains_9.Field(),
                        __param(0, domains_9.Inject(function () { return 'baz'; })),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", [String]),
                        __metadata("design:returntype", String)
                    ], Foo.prototype, "bar", null);
                    Foo = __decorate([
                        domains_9.ObjectType()
                    ], Foo);
                    return Foo;
                }());
                bar = domains_9.compileObjectType(Foo).getFields().bar;
                expect(bar.args.length).toEqual(0);
                return [2 /*return*/];
            });
        }); });
        it('Will throw if trying to mark argument both with @Inject and @Arg', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo;
            return __generator(this, function (_a) {
                Foo = /** @class */ (function () {
                    function Foo() {
                    }
                    Foo.prototype.bar = function (test) {
                        return test;
                    };
                    __decorate([
                        domains_9.Field(),
                        __param(0, domains_9.Arg()),
                        __param(0, domains_9.Inject(function () { return 'baz'; })),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", [String]),
                        __metadata("design:returntype", String)
                    ], Foo.prototype, "bar", null);
                    Foo = __decorate([
                        domains_9.ObjectType()
                    ], Foo);
                    return Foo;
                }());
                expect(function () { return domains_9.compileObjectType(Foo).getFields(); }).toThrowErrorMatchingSnapshot();
                return [2 /*return*/];
            });
        }); });
        it('Will properly inject Context, Source and Info', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                            }
                            Foo.prototype.bar = function (context, source, info) {
                                if (context === 'context' && source === this && info === null) {
                                    return 42;
                                }
                            };
                            __decorate([
                                domains_9.Field(),
                                __param(0, domains_9.Context), __param(1, domains_9.Source), __param(2, domains_9.Info),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String, Foo, Object]),
                                __metadata("design:returntype", Number)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_9.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_9.compileObjectType(Foo).getFields().bar;
                        _a = expect;
                        return [4 /*yield*/, bar.resolve(new Foo(), null, 'context', null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(42);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Will properly mix Injected and normal Arguments', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                            }
                            Foo.prototype.bar = function (zzz, context, answer) {
                                return zzz + "." + context + "." + answer;
                            };
                            __decorate([
                                domains_9.Field(),
                                __param(0, domains_9.Arg()),
                                __param(1, domains_9.Context),
                                __param(2, domains_9.Inject(function () { return 42; })),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String, String, Number]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_9.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_9.compileObjectType(Foo).getFields().bar;
                        expect(bar.args.length).toEqual(1);
                        _a = expect;
                        return [4 /*yield*/, bar.resolve(new Foo(), { zzz: 'zzz' }, 'context', null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('zzz.context.42');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Will allow `this` inside injectors', function () { return __awaiter(_this, void 0, void 0, function () {
            var Foo, bar, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.test = 'test';
                            }
                            Foo.prototype.bar = function (baz) {
                                return baz;
                            };
                            __decorate([
                                domains_9.Field(),
                                __param(0, domains_9.Inject(function () {
                                    return this.test;
                                })),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_9.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_9.compileObjectType(Foo).getFields().bar;
                        _a = expect;
                        return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('Will allow injecting async values', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var Foo, bar, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Foo = /** @class */ (function () {
                            function Foo() {
                                this.test = 'test';
                            }
                            Foo.prototype.bar = function (baz) {
                                return baz;
                            };
                            __decorate([
                                domains_9.Field(),
                                __param(0, domains_9.Inject(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, utils_15.wait(1)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, 'async'];
                                        }
                                    });
                                }); })),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String]),
                                __metadata("design:returntype", String)
                            ], Foo.prototype, "bar", null);
                            Foo = __decorate([
                                domains_9.ObjectType()
                            ], Foo);
                            return Foo;
                        }());
                        bar = domains_9.compileObjectType(Foo).getFields().bar;
                        _a = expect;
                        return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual('async');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
define("test/objectType/index.spec", ["require", "exports", "graphql", "domains", "domains/field"], function (require, exports, graphql_12, domains_10, field_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Type', function () {
        it('Throws when trying to compile type without @Type decorator', function () {
            expect(function () { return domains_10.compileObjectType(/** @class */ (function () {
                function Bar() {
                }
                return Bar;
            }())); }).toThrowErrorMatchingSnapshot();
        });
        it('Throws when @Type has no fields', function () {
            var NoFields = /** @class */ (function () {
                function NoFields() {
                }
                NoFields = __decorate([
                    domains_10.ObjectType()
                ], NoFields);
                return NoFields;
            }());
            var NoDeclaredFields = /** @class */ (function () {
                function NoDeclaredFields() {
                }
                NoDeclaredFields = __decorate([
                    domains_10.ObjectType()
                ], NoDeclaredFields);
                return NoDeclaredFields;
            }());
            expect(function () { return domains_10.compileObjectType(NoFields); }).toThrowErrorMatchingSnapshot();
            expect(function () { return domains_10.compileObjectType(NoDeclaredFields); }).toThrowErrorMatchingSnapshot();
        });
        it('Compiles basic type with field', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    field_4.Field(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_10.ObjectType()
                ], Foo);
                return Foo;
            }());
            var compiled = domains_10.compileObjectType(Foo);
            var fields = compiled.getFields();
            var barField = fields.bar;
            expect(compiled).toBeInstanceOf(graphql_12.GraphQLObjectType);
            expect(barField).toBeTruthy();
            expect(barField.name).toEqual('bar');
        });
        it('Sets proper options', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    field_4.Field(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_10.ObjectType({ description: 'Baz' })
                ], Foo);
                return Foo;
            }());
            var compiled = domains_10.compileObjectType(Foo);
            expect(compiled.description).toEqual('Baz');
            expect(compiled.name).toEqual('Foo');
            var FooCustomName = /** @class */ (function () {
                function FooCustomName() {
                }
                __decorate([
                    field_4.Field(),
                    __metadata("design:type", String)
                ], FooCustomName.prototype, "bar", void 0);
                FooCustomName = __decorate([
                    domains_10.ObjectType({ name: 'Baz' })
                ], FooCustomName);
                return FooCustomName;
            }());
            var compiledCustomName = domains_10.compileObjectType(FooCustomName);
            expect(compiledCustomName.name).toEqual('Baz');
        });
        it('Final type is compiled only once per class', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    field_4.Field(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_10.ObjectType()
                ], Foo);
                return Foo;
            }());
            var compiledA = domains_10.compileObjectType(Foo);
            var compiledB = domains_10.compileObjectType(Foo);
            expect(compiledA).toBe(compiledB);
        });
    });
});
define("test/schema/index.spec", ["require", "exports", "domains", "graphql"], function (require, exports, domains_11, graphql_13) {
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('@Schema', function () {
        it('should not allow compiling schema not decorated with @Schema', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                return Foo;
            }());
            expect(function () { return domains_11.compileSchema(Foo); }).toThrowErrorMatchingSnapshot();
        });
        it('should not allow @Schema without any @Query field', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                Foo = __decorate([
                    domains_11.Schema()
                ], Foo);
                return Foo;
            }());
            expect(function () { return domains_11.compileSchema(Foo); }).toThrowErrorMatchingSnapshot();
        });
        it('should not allow registering query filed that is not compilable to GraphQLObjectType', function () {
            var Foo = /** @class */ (function () {
                function Foo() {
                }
                __decorate([
                    domains_11.Query(),
                    __metadata("design:type", String)
                ], Foo.prototype, "bar", void 0);
                Foo = __decorate([
                    domains_11.Schema()
                ], Foo);
                return Foo;
            }());
            expect(function () { return domains_11.compileSchema(Foo); }).toThrowErrorMatchingSnapshot();
        });
        it('should properly register and resolve schema with query field of type GraphQLObjectType', function () { return __awaiter(_this, void 0, void 0, function () {
            var Hello, FooSchema, schema, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Hello = /** @class */ (function () {
                            function Hello() {
                            }
                            Hello.prototype.world = function (name) {
                                return "Hello, " + name;
                            };
                            __decorate([
                                domains_11.Field(),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", [String]),
                                __metadata("design:returntype", String)
                            ], Hello.prototype, "world", null);
                            Hello = __decorate([
                                domains_11.ObjectType()
                            ], Hello);
                            return Hello;
                        }());
                        FooSchema = /** @class */ (function () {
                            function FooSchema() {
                            }
                            FooSchema.prototype.hello = function () {
                                return new Hello();
                            };
                            __decorate([
                                domains_11.Query(),
                                __metadata("design:type", Function),
                                __metadata("design:paramtypes", []),
                                __metadata("design:returntype", Hello)
                            ], FooSchema.prototype, "hello", null);
                            FooSchema = __decorate([
                                domains_11.Schema()
                            ], FooSchema);
                            return FooSchema;
                        }());
                        schema = domains_11.compileSchema(FooSchema);
                        return [4 /*yield*/, graphql_13.graphql(schema, "\n        {\n          hello {\n            world(name: \"Bob\")\n          }\n        }\n      ")];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({ data: { hello: { world: 'Hello, Bob' } } });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
define("test/union/index.spec", ["require", "exports", "domains", "services/utils"], function (require, exports, domains_12, utils_16) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sub1 = /** @class */ (function () {
        function Sub1() {
        }
        __decorate([
            domains_12.Field(),
            __metadata("design:type", String)
        ], Sub1.prototype, "bar", void 0);
        Sub1 = __decorate([
            domains_12.ObjectType()
        ], Sub1);
        return Sub1;
    }());
    var Sub2 = /** @class */ (function () {
        function Sub2() {
        }
        __decorate([
            domains_12.Field(),
            __metadata("design:type", Number)
        ], Sub2.prototype, "bar", void 0);
        Sub2 = __decorate([
            domains_12.ObjectType()
        ], Sub2);
        return Sub2;
    }());
    var UnionType = /** @class */ (function () {
        function UnionType() {
        }
        UnionType = __decorate([
            domains_12.Union({ types: [Sub1, Sub2] })
        ], UnionType);
        return UnionType;
    }());
    var Foo = /** @class */ (function () {
        function Foo() {
        }
        __decorate([
            domains_12.Field({ type: UnionType }),
            __metadata("design:type", Object)
        ], Foo.prototype, "bar", void 0);
        Foo = __decorate([
            domains_12.ObjectType()
        ], Foo);
        return Foo;
    }());
    describe('Unions', function () {
        it('Registers returns proper enum type', function () {
            var bar = domains_12.compileObjectType(Foo).getFields().bar;
            expect(bar.type).toEqual(utils_16.resolveType(UnionType));
            expect(bar.type).not.toEqual(UnionType);
        });
        it('Properly resolves type of union', function () {
            var bar = domains_12.compileObjectType(Foo).getFields().bar;
            var unionType = bar.type;
            expect(unionType.resolveType(new Sub1(), null, null)).toBe(utils_16.resolveType(Sub1));
            expect(unionType.resolveType(new Sub2(), null, null)).toBe(utils_16.resolveType(Sub2));
        });
    });
});
define("test/utils/index", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function wait(time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time); });
    }
    exports.wait = wait;
});
