import { Client } from "colyseus";
import { CharacterBaseStats, GrowthRate, playerState } from "../Config/PlayerConfig";
import { JobEnum, PlayerDataJoin_C4PE, PlayerData_C4PE } from "../Model/PlayerData_C4PE";
import { Player_C4PE } from "../Model/Player_C4PE";
import { Room_C4PE } from "../Model/Room_C4PE";

class Controller_C4PE {
    PlayerJoin(room: Room_C4PE, client: Client, playerDataJoin: PlayerDataJoin_C4PE) {
        room.state.createPlayer(client.sessionId)
        var playerData = InitPlayerData(client, playerDataJoin);
        room.playerDataDic.Add(client.sessionId, playerData);
    }

    PlayerLeave(room: Room_C4PE, client: Client) {
        room.state.removePlayer(client.sessionId)
        room.playerDataDic.Remove(client.sessionId)
    }

    PlayerReady(room: Room_C4PE, client: Client) {
        var player = room.state.players.get(client.sessionId);
        if (player == null || player == undefined) return;
        player.state = playerState.Ready;
        var everyoneReady = true;
        room.state.players.forEach(element => {
            if(element.state != playerState.Ready){
                everyoneReady = false;
                return;
            }
        });
        if(everyoneReady) this.GameStart(room);
    }

    GameStart(room: Room_C4PE){

    }
}

export const controller_C4PE = new Controller_C4PE();

function InitPlayerData(client: Client, playerDataJoin: PlayerDataJoin_C4PE) {
    var playerData = new PlayerData_C4PE();
    playerData.sessionId = client.sessionId;
    playerData.playerID = playerDataJoin.playerID;
    playerData.playerName = playerDataJoin.playerName;
    playerData.playerIcon = playerDataJoin.playerIcon;
    playerData.Job = playerDataJoin.Job;
    playerData.Lv = 1;
    SetStats(playerData);
    return playerData;
}

function SetStats(playerData: PlayerData_C4PE) {
    playerData.STR = CharacterBaseStats.BASE_STR + GrowthRate[playerData.Job].STR * playerData.Lv;
    playerData.VIT = CharacterBaseStats.BASE_VIT + GrowthRate[playerData.Job].VIT * playerData.Lv;
    playerData.DEX = CharacterBaseStats.BASE_DEX + GrowthRate[playerData.Job].DEX * playerData.Lv;
    playerData.MND = CharacterBaseStats.BASE_MND + GrowthRate[playerData.Job].MND * playerData.Lv;
    playerData.SPI = CharacterBaseStats.BASE_SPI + GrowthRate[playerData.Job].SPI * playerData.Lv;
    playerData.SPD = CharacterBaseStats.BASE_SPD + GrowthRate[playerData.Job].SPD * playerData.Lv;
    playerData.HIT = CharacterBaseStats.BASE_HIT;
    playerData.EVA = CharacterBaseStats.BASE_EVA;
    playerData.CRI = CharacterBaseStats.BASE_CRI;
    playerData.CRD = CharacterBaseStats.BASE_CRD;
    playerData.VIS = CharacterBaseStats.BASE_VIS;
    playerData.HP = CharacterBaseStats.BASE_HP + GrowthRate[playerData.Job].HP * playerData.Lv;
    playerData.MP = CharacterBaseStats.BASE_MP + GrowthRate[playerData.Job].MP * playerData.Lv;
}
