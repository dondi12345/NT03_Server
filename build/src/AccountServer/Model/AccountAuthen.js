"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAuthen = void 0;
class AccountAuthen {
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
exports.AccountAuthen = AccountAuthen;
