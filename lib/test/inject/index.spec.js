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
var domains_1 = require("domains");
var utils_1 = require("../utils");
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
                            domains_1.Field(),
                            __param(0, domains_1.Inject(function () { return 'baz'; })),
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
                    domains_1.Field(),
                    __param(0, domains_1.Inject(function () { return 'baz'; })),
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
                    domains_1.Field(),
                    __param(0, domains_1.Arg()),
                    __param(0, domains_1.Inject(function () { return 'baz'; })),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", String)
                ], Foo.prototype, "bar", null);
                Foo = __decorate([
                    domains_1.ObjectType()
                ], Foo);
                return Foo;
            }());
            expect(function () { return domains_1.compileObjectType(Foo).getFields(); }).toThrowErrorMatchingSnapshot();
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
                            domains_1.Field(),
                            __param(0, domains_1.Context), __param(1, domains_1.Source), __param(2, domains_1.Info),
                            __metadata("design:type", Function),
                            __metadata("design:paramtypes", [String, Foo, Object]),
                            __metadata("design:returntype", Number)
                        ], Foo.prototype, "bar", null);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
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
                            domains_1.Field(),
                            __param(0, domains_1.Arg()),
                            __param(1, domains_1.Context),
                            __param(2, domains_1.Inject(function () { return 42; })),
                            __metadata("design:type", Function),
                            __metadata("design:paramtypes", [String, String, Number]),
                            __metadata("design:returntype", String)
                        ], Foo.prototype, "bar", null);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
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
                            domains_1.Field(),
                            __param(0, domains_1.Inject(function () {
                                return this.test;
                            })),
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
                            domains_1.Field(),
                            __param(0, domains_1.Inject(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, utils_1.wait(1)];
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
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    bar = domains_1.compileObjectType(Foo).getFields().bar;
                    _a = expect;
                    return [4 /*yield*/, bar.resolve(new Foo(), null, null, null)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual('async');
                    return [2 /*return*/];
            }
        });
    }); });
});
