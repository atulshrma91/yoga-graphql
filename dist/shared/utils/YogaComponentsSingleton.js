"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var YogaComponentsSingleton = (function () {
    function YogaComponentsSingleton() {
        Object.defineProperty(this, "_prismaClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_yoga", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    Object.defineProperty(YogaComponentsSingleton, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!YogaComponentsSingleton.instance) {
                throw new Error("You need to create an instance first.");
            }
            return YogaComponentsSingleton.instance;
        }
    });
    Object.defineProperty(YogaComponentsSingleton, "createInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (yoga) {
            if (!YogaComponentsSingleton.instance) {
                YogaComponentsSingleton.instance = new YogaComponentsSingleton();
            }
            YogaComponentsSingleton.instance._yoga = yoga;
            YogaComponentsSingleton.instance._prismaClient = yoga.prisma;
        }
    });
    Object.defineProperty(YogaComponentsSingleton.prototype, "prismaClient", {
        get: function () {
            if (YogaComponentsSingleton.instance) {
                return this._prismaClient;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(YogaComponentsSingleton.prototype, "yoga", {
        get: function () {
            if (YogaComponentsSingleton.instance) {
                return this._yoga;
            }
        },
        enumerable: false,
        configurable: true
    });
    return YogaComponentsSingleton;
}());
exports.default = YogaComponentsSingleton;
//# sourceMappingURL=YogaComponentsSingleton.js.map