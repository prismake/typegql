Object.defineProperty(exports, "__esModule", { value: true });
var domains_1 = require("domains");
var utils_1 = require("services/utils");
describe('Enums', function () {
    it('Registers returns proper enum type', function () {
        var Foo;
        (function (Foo) {
            Foo[Foo["Bar"] = 0] = "Bar";
            Foo[Foo["Baz"] = 1] = "Baz";
        })(Foo || (Foo = {}));
        var enumType = domains_1.registerEnum(Foo, 'Foo');
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
        var enumType = domains_1.registerEnum(Foo, 'Foo');
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
        domains_1.registerEnum(Foo, { name: 'Foo' });
        expect(function () { return domains_1.registerEnum(Foo, { name: 'Foo2' }); }).toThrowErrorMatchingSnapshot();
    });
    it('Will properly resolve registered enum', function () {
        var Foo;
        (function (Foo) {
            Foo["Bar"] = "Test";
            Foo["Baz"] = "Test2";
        })(Foo || (Foo = {}));
        var enumType = domains_1.registerEnum(Foo, { name: 'Foo' });
        expect(utils_1.resolveType(Foo)).toEqual(enumType);
    });
});
