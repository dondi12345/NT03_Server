"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller_C4PE = void 0;
const PlayerConfig_1 = require("../Config/PlayerConfig");
const PlayerData_C4PE_1 = require("../Model/PlayerData_C4PE");
class Controller_C4PE {
    PlayerJoin(room, client, playerDataJoin) {
        room.state.createPlayer(client.sessionId);
        var playerData = InitPlayerData(client, playerDataJoin);
        room.playerDataDic.Add(client.sessionId, playerData);
    }
    PlayerLeave(room, client) {
        room.state.removePlayer(client.sessionId);
        room.playerDataDic.Remove(client.sessionId);
    }
    PlayerReady(room, client) {
        var player = room.state.players.get(client.sessionId);
        if (player == null || player == undefined)
            return;
        player.state = PlayerConfig_1.playerState.Ready;
        var everyoneReady = true;
        room.state.players.forEach(element => {
            if (element.state != PlayerConfig_1.playerState.Ready) {
                everyoneReady = false;
                return;
            }
        });
        if (everyoneReady)
            this.GameStart(room);
    }
    GameStart(room) {
    }
}
exports.controller_C4PE = new Controller_C4PE();
function InitPlayerData(client, playerDataJoin) {
    var playerData = new PlayerData_C4PE_1.PlayerData_C4PE();
    playerData.sessionId = client.sessionId;
    playerData.playerID = playerDataJoin.playerID;
    playerData.playerName = playerDataJoin.playerName;
    playerData.playerIcon = playerDataJoin.playerIcon;
    playerData.Job = playerDataJoin.Job;
    playerData.Lv = 1;
    SetStats(playerData);
    return playerData;
}
function SetStats(playerData) {
    playerData.STR = PlayerConfig_1.CharacterBaseStats.BASE_STR + PlayerConfig_1.GrowthRate[playerData.Job].STR * playerData.Lv;
    playerData.VIT = PlayerConfig_1.CharacterBaseStats.BASE_VIT + PlayerConfig_1.GrowthRate[playerData.Job].VIT * playerData.Lv;
    playerData.DEX = PlayerConfig_1.CharacterBaseStats.BASE_DEX + PlayerConfig_1.GrowthRate[playerData.Job].DEX * playerData.Lv;
    playerData.MND = PlayerConfig_1.CharacterBaseStats.BASE_MND + PlayerConfig_1.GrowthRate[playerData.Job].MND * playerData.Lv;
    playerData.SPI = PlayerConfig_1.CharacterBaseStats.BASE_SPI + PlayerConfig_1.GrowthRate[playerData.Job].SPI * playerData.Lv;
    playerData.SPD = PlayerConfig_1.CharacterBaseStats.BASE_SPD + PlayerConfig_1.GrowthRate[playerData.Job].SPD * playerData.Lv;
    playerData.HIT = PlayerConfig_1.CharacterBaseStats.BASE_HIT;
    playerData.EVA = PlayerConfig_1.CharacterBaseStats.BASE_EVA;
    playerData.CRI = PlayerConfig_1.CharacterBaseStats.BASE_CRI;
    playerData.CRD = PlayerConfig_1.CharacterBaseStats.BASE_CRD;
    playerData.VIS = PlayerConfig_1.CharacterBaseStats.BASE_VIS;
    playerData.HP = PlayerConfig_1.CharacterBaseStats.BASE_HP + PlayerConfig_1.GrowthRate[playerData.Job].HP * playerData.Lv;
    playerData.MP = PlayerConfig_1.CharacterBaseStats.BASE_MP + PlayerConfig_1.GrowthRate[playerData.Job].MP * playerData.Lv;
}
