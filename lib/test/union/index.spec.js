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
var domains_1 = require("domains");
var utils_1 = require("services/utils");
var Sub1 = /** @class */ (function () {
    function Sub1() {
    }
    __decorate([
        domains_1.Field(),
        __metadata("design:type", String)
    ], Sub1.prototype, "bar", void 0);
    Sub1 = __decorate([
        domains_1.ObjectType()
    ], Sub1);
    return Sub1;
}());
var Sub2 = /** @class */ (function () {
    function Sub2() {
    }
    __decorate([
        domains_1.Field(),
        __metadata("design:type", Number)
    ], Sub2.prototype, "bar", void 0);
    Sub2 = __decorate([
        domains_1.ObjectType()
    ], Sub2);
    return Sub2;
}());
var UnionType = /** @class */ (function () {
    function UnionType() {
    }
    UnionType = __decorate([
        domains_1.Union({ types: [Sub1, Sub2] })
    ], UnionType);
    return UnionType;
}());
var Foo = /** @class */ (function () {
    function Foo() {
    }
    __decorate([
        domains_1.Field({ type: UnionType }),
        __metadata("design:type", Object)
    ], Foo.prototype, "bar", void 0);
    Foo = __decorate([
        domains_1.ObjectType()
    ], Foo);
    return Foo;
}());
describe('Unions', function () {
    it('Registers returns proper enum type', function () {
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        expect(bar.type).toEqual(utils_1.resolveType(UnionType));
        expect(bar.type).not.toEqual(UnionType);
    });
    it('Properly resolves type of union', function () {
        var bar = domains_1.compileObjectType(Foo).getFields().bar;
        var unionType = bar.type;
        expect(unionType.resolveType(new Sub1(), null, null)).toBe(utils_1.resolveType(Sub1));
        expect(unionType.resolveType(new Sub2(), null, null)).toBe(utils_1.resolveType(Sub2));
    });
});
