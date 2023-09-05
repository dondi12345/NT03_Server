"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSGChat = void 0;
class MSGChat {
    constructor() {
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
exports.MSGChat = MSGChat;
