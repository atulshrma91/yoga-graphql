"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
function compose() {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i] = arguments[_i];
    }
    if (funcs.length === 0) {
        return function (o) {
            return o;
        };
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    var last = funcs[funcs.length - 1];
    return function (f) {
        var result = last(f);
        for (var index = funcs.length - 2; index >= 0; index--) {
            var fn = funcs[index];
            result = fn(result);
        }
        return result;
    };
}
exports.compose = compose;
//# sourceMappingURL=composable.resolver.js.map