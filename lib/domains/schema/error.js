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
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("services/error");
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
}(error_1.BaseError));
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
}(error_1.BaseError));
exports.SchemaFieldError = SchemaFieldError;
