var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
require("reflect-metadata");
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
                            domains_1.Field(),
                            __metadata("design:type", String)
                        ], Foo.prototype, "bar", void 0);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    compiled = domains_1.compileObjectType(Foo);
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
                            domains_1.Field(),
                            __metadata("design:type", Function),
                            __metadata("design:paramtypes", []),
                            __metadata("design:returntype", String)
                        ], Foo.prototype, "bar", null);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    compiled = domains_1.compileObjectType(Foo);
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
                domains_1.Field({ description: 'test' }),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        expect(domains_1.compileObjectType(Foo).getFields().bar.description).toEqual('test');
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
                            domains_1.Field({ name: 'baz', description: 'test' }),
                            __metadata("design:type", String)
                        ], Foo.prototype, "bar", void 0);
                        Foo = __decorate([
                            domains_1.ObjectType()
                        ], Foo);
                        return Foo;
                    }());
                    compiled = domains_1.compileObjectType(Foo);
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
                domains_1.Field(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Number)
            ], Foo.prototype, "baz", void 0);
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Boolean)
            ], Foo.prototype, "foo", void 0);
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Boolean)
            ], Foo.prototype, "coo", void 0);
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", Boolean)
            ], Foo.prototype, "boo", null);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var _a = domains_1.compileObjectType(Foo).getFields(), bar = _a.bar, baz = _a.baz, foo = _a.foo, boo = _a.boo, coo = _a.coo;
        expect(bar.type).toEqual(graphql_1.GraphQLString);
        expect(baz.type).toEqual(graphql_1.GraphQLFloat);
        expect(foo.type).toEqual(graphql_1.GraphQLBoolean);
        expect(boo.type).toEqual(graphql_1.GraphQLBoolean);
        expect(coo.type).toEqual(graphql_1.GraphQLBoolean);
    });
    it('Properly sets forced field type', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                domains_1.Field({ type: function () { return graphql_1.GraphQLFloat; } }),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        expect(bar.type).toEqual(graphql_1.GraphQLFloat);
    });
    it('Supports references to other types', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                domains_1.Field(),
                __metadata("design:type", String)
            ], Foo.prototype, "foo", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var Bar = /** @class */ (function () {
            function Bar() {
            }
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Foo)
            ], Bar.prototype, "foo", void 0);
            Bar = __decorate([
                domains_1.ObjectType()
            ], Bar);
            return Bar;
        }());
        var foo = domains_1.compileObjectType(Bar).getFields().foo;
        var compiledFoo = domains_1.compileObjectType(Foo);
        expect(foo.type).toBe(compiledFoo);
    });
    it('Supports references to itself', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Foo)
            ], Foo.prototype, "fooNested", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var fooNested = domains_1.compileObjectType(Foo).getFields().fooNested;
        expect(fooNested.type).toBe(domains_1.compileObjectType(Foo));
    });
    it('Supports circular references', function () {
        var Car = /** @class */ (function () {
            function Car() {
            }
            __decorate([
                domains_1.Field({ type: function () { return Owner; } }),
                __metadata("design:type", Owner)
            ], Car.prototype, "owner", void 0);
            Car = __decorate([
                domains_1.ObjectType()
            ], Car);
            return Car;
        }());
        var Owner = /** @class */ (function () {
            function Owner() {
            }
            __decorate([
                domains_1.Field({ type: function () { return Car; } }),
                __metadata("design:type", Car)
            ], Owner.prototype, "car", void 0);
            Owner = __decorate([
                domains_1.ObjectType()
            ], Owner);
            return Owner;
        }());
        // console.log({ Car, Owner });
        var owner = domains_1.compileObjectType(Car).getFields().owner;
        var car = domains_1.compileObjectType(Owner).getFields().car;
        // console.log({ owner, car });
        expect(owner.type).toBe(domains_1.compileObjectType(Owner));
        expect(car.type).toBe(domains_1.compileObjectType(Car));
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
                domains_1.Field({ type: function () { return Foo; } }),
                __metadata("design:type", Foo)
            ], Bar.prototype, "foo", void 0);
            Bar = __decorate([
                domains_1.ObjectType()
            ], Bar);
            return Bar;
        }());
        expect(function () { return domains_1.compileObjectType(Bar).getFields(); }).toThrowErrorMatchingSnapshot();
    });
    it('Properly resolves native scalar types', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                domains_1.Field({ type: function () { return String; } }),
                __metadata("design:type", Object)
            ], Foo.prototype, "bar", void 0);
            __decorate([
                domains_1.Field({ type: function () { return Number; } }),
                __metadata("design:type", Object)
            ], Foo.prototype, "baz", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var _a = domains_1.compileObjectType(Foo).getFields(), bar = _a.bar, baz = _a.baz;
        expect(bar.type).toBe(graphql_1.GraphQLString);
        expect(baz.type).toBe(graphql_1.GraphQLFloat);
    });
});
