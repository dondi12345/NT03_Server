"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = void 0;
const mongoose_1 = require("mongoose");
class UserSocket {
    constructor() {
        this.IdAccount = new mongoose_1.Types.ObjectId();
        this.IdUserPlayer = new mongoose_1.Types.ObjectId();
    }
}
exports.UserSocket = UserSocket;
