"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopBuyResByCurrency = void 0;
class ShopBuyResByCurrency {
    constructor() {
        this.NameCurrency = 0;
        this.Number = 0;
        this.ResIn = 0;
        this.NumberIn = 0;
    }
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.ShopBuyResByCurrency = ShopBuyResByCurrency;
