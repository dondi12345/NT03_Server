"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountData = void 0;
class AccountData {
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
exports.AccountData = AccountData;
