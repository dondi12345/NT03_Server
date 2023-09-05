"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferData = void 0;
const Env_1 = require("./Enviroment/Env");
class TransferData {
    Send(...data) {
        var res = {
            Status: 1,
            Data: data,
        };
        try {
            this.Socket.emit(Env_1.SocketConfig.Listening, JSON.stringify(res));
        }
        catch (error) { }
        try {
            this.ResAPI.send(JSON.stringify(res));
        }
        catch (error) { }
    }
}
exports.TransferData = TransferData;
