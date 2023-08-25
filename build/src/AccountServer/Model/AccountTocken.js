"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTocken = void 0;
class AccountTocken {
    constructor() {
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.AccountTocken = AccountTocken;
