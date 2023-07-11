"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGame = void 0;
class ServerGame {
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.ServerGame = ServerGame;
