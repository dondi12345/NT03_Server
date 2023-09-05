"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.MessageData = void 0;
class MessageData {
    constructor(data) {
        this.Status = true;
        this.Data = data;
    }
}
exports.MessageData = MessageData;
class Message {
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
exports.Message = Message;
