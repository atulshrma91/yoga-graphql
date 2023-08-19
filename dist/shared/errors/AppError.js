"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error = (function () {
    function Error(message, statusCode) {
        if (statusCode === void 0) { statusCode = 400; }
        Object.defineProperty(this, "message", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "statusCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.message = message;
        this.statusCode = statusCode;
    }
    return Error;
}());
exports.default = Error;
//# sourceMappingURL=AppError.js.map