"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor() {
        this.Time = new Date;
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
exports.Chat = Chat;
