"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocketData = void 0;
class UserSocketData {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.UserSocketData = UserSocketData;
