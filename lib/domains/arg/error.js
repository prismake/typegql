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
var utils_1 = require("services/utils");
var ArgError = /** @class */ (function (_super) {
    __extends(ArgError, _super);
    function ArgError(target, fieldName, argIndex, msg) {
        var _this = this;
        var paramNames = utils_1.getParameterNames(target.prototype[fieldName]);
        var paramName = paramNames[argIndex];
        var fullMsg = "@Type " + target.name + "." + fieldName + "(" + paramName + " <-------): " + msg;
        _this = _super.call(this, fullMsg) || this;
        _this.message = fullMsg;
        return _this;
    }
    return ArgError;
}(error_1.BaseError));
exports.ArgError = ArgError;
