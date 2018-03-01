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
}(error_1.BaseError));
exports.UnionError = UnionError;
