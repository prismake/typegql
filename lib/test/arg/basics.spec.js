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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var domains_1 = require("domains");
describe('Arguments with @Arg', function () {
    it('Allows setting argument with @Arg decorator', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            Foo.prototype.bar = function (baz) {
                return baz;
            };
            __decorate([
                domains_1.Field(),
                __param(0, domains_1.Arg()),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [String]),
                __metadata("design:returntype", String)
            ], Foo.prototype, "bar", null);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        expect(bar.args.length).toEqual(1);
        var bazArg = bar.args[0];
        expect(bazArg.type).toBe(graphql_1.GraphQLString);
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
                domains_1.Field(),
                __param(0, domains_1.Arg({ description: 'test' })),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [String]),
                __metadata("design:returntype", String)
            ], Foo.prototype, "bar", null);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var bazArg = domains_1.compileObjectType(Foo).getFields().bar.args[0];
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
                            domains_1.Field(),
                            __metadata("design:type", Function),
                            __metadata("design:paramtypes", [String, String]),
                            __metadata("design:returntype", String)
                        ], Foo.prototype, "bar", null);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
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
                            domains_1.Field(),
                            __metadata("design:type", Function),
                            __metadata("design:paramtypes", [String]),
                            __metadata("design:returntype", String)
                        ], Foo.prototype, "bar", null);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
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
                            domains_1.Field(),
                            __metadata("design:type", String)
                        ], Foo.prototype, "bar", void 0);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
                    return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                case 1:
                    resolvedValue = _a.sent();
                    expect(resolvedValue).toEqual('instance');
                    return [2 /*return*/];
            }
        });
    }); });
});
