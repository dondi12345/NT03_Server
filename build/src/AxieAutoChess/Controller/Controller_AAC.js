"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller_AAC = void 0;
const Enum_AAC_1 = require("../Model/Enum_AAC");
class Controller_AAC {
    PlayerJoin(room, client, playerData) {
        room.state.createPlayer(client.sessionId);
        playerData.SessionId = client.sessionId;
        room.playerDataDic.Add(client.sessionId, playerData);
    }
    PlayerLeave(room, client) {
        room.playerDataDic.Remove(client.sessionId);
        room.playerDataDic.Remove(client.sessionId);
    }
    PlayerReady(room, client) {
        var player = room.state.players.get(client.sessionId);
        if (player == null || player == undefined)
            return;
        player.status = Enum_AAC_1.PlayerStatus_AAC.Ready;
        var everyoneReady = true;
        room.state.players.forEach(element => {
            if (element.status != Enum_AAC_1.PlayerStatus_AAC.Ready) {
                everyoneReady = false;
                return;
            }
        });
        if (everyoneReady)
            this.GameStart(room);
    }
    GameStart(room) {
        room.lock();
        room.state.status = Enum_AAC_1.StateStatus_AAC.Matching;
    }
}
exports.controller_AAC = new Controller_AAC();
