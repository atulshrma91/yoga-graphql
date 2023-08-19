"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IGenerateWalletsSummary = (function () {
    function IGenerateWalletsSummary() {
        Object.defineProperty(this, "currencySymbol", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "wallets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "transactional", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collateral", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "staking", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "membership", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.currencySymbol = "";
        this.wallets = {
            Transactional: {
                totalBalance: "0",
                totalWallets: 0,
                assets: [],
            },
            Collateral: {
                totalBalance: "0",
                totalWallets: 0,
                assets: [],
            },
            Staking: {
                stakedBalance: "0",
                totalWallets: 0,
                assets: [],
            },
            Membership: {
                membershipType: "",
                fiatCnfiPrice: "",
                committedCnfi: "",
            },
        };
        this.transactional = [];
        this.collateral = [];
        this.staking = [];
        this.membership = {
            walletId: "",
            nickname: "",
            membershipType: "",
        };
    }
    return IGenerateWalletsSummary;
}());
exports.default = IGenerateWalletsSummary;
//# sourceMappingURL=IGenerateWalletsSummary.js.map