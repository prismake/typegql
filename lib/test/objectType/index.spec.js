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
var field_1 = require("domains/field");
describe('Type', function () {
    it('Throws when trying to compile type without @Type decorator', function () {
        expect(function () { return domains_1.compileObjectType(/** @class */ (function () {
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
                domains_1.ObjectType()
            ], NoFields);
            return NoFields;
        }());
        var NoDeclaredFields = /** @class */ (function () {
            function NoDeclaredFields() {
            }
            NoDeclaredFields = __decorate([
                domains_1.ObjectType()
            ], NoDeclaredFields);
            return NoDeclaredFields;
        }());
        expect(function () { return domains_1.compileObjectType(NoFields); }).toThrowErrorMatchingSnapshot();
        expect(function () { return domains_1.compileObjectType(NoDeclaredFields); }).toThrowErrorMatchingSnapshot();
    });
    it('Compiles basic type with field', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                field_1.Field(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var compiled = domains_1.compileObjectType(Foo);
        var fields = compiled.getFields();
        var barField = fields.bar;
        expect(compiled).toBeInstanceOf(graphql_1.GraphQLObjectType);
        expect(barField).toBeTruthy();
        expect(barField.name).toEqual('bar');
    });
    it('Sets proper options', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                field_1.Field(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            Foo = __decorate([
                domains_1.ObjectType({ description: 'Baz' })
            ], Foo);
            return Foo;
        }());
        var compiled = domains_1.compileObjectType(Foo);
        expect(compiled.description).toEqual('Baz');
        expect(compiled.name).toEqual('Foo');
        var FooCustomName = /** @class */ (function () {
            function FooCustomName() {
            }
            __decorate([
                field_1.Field(),
                __metadata("design:type", String)
            ], FooCustomName.prototype, "bar", void 0);
            FooCustomName = __decorate([
                domains_1.ObjectType({ name: 'Baz' })
            ], FooCustomName);
            return FooCustomName;
        }());
        var compiledCustomName = domains_1.compileObjectType(FooCustomName);
        expect(compiledCustomName.name).toEqual('Baz');
    });
    it('Final type is compiled only once per class', function () {
        var Foo = /** @class */ (function () {
            function Foo() {
            }
            __decorate([
                field_1.Field(),
                __metadata("design:type", String)
            ], Foo.prototype, "bar", void 0);
            Foo = __decorate([
                domains_1.ObjectType()
            ], Foo);
            return Foo;
        }());
        var compiledA = domains_1.compileObjectType(Foo);
        var compiledB = domains_1.compileObjectType(Foo);
        expect(compiledA).toBe(compiledB);
    });
});
