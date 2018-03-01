var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var domains_1 = require("domains");
describe('Arguments', function () {
    it('Infers basic arguments without @Arg decorator', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            Foo.prototype.bar = function (baz) {
                return baz;
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
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        expect(bar.args.length).toBeGreaterThan(0);
        var bazArg = bar.args[0];
        expect(bazArg.type).toBe(graphql_1.GraphQLString);
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
                domains_1.Field(),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", String)
            ], Foo.prototype, "bar", null);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        expect(function () { return domains_1.compileObjectType(Foo).getFields(); }).toThrowErrorMatchingSnapshot();
    });
    it('Infers multiple basic arguments without @Arg decorator', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            Foo.prototype.bar = function (baz, boo) {
                return baz;
            };
            __decorate([
                domains_1.Field(),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [String, Number]),
                __metadata("design:returntype", String)
            ], Foo.prototype, "bar", null);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        expect(bar.args.length).toEqual(2);
        var _a = bar.args, bazArg = _a[0], booArg = _a[1];
        expect(bazArg.type).toBe(graphql_1.GraphQLString);
        expect(bazArg.name).toBe('baz');
        expect(booArg.name).toBe('boo');
        expect(booArg.type).toBe(graphql_1.GraphQLFloat);
    });
});
