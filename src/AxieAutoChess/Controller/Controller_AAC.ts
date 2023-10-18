import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { PlayerInfor_AAC } from "../Model/PlayerSub_AAC";
import { Round, Start_Config } from "../Config/Config_AAC";

class Controller_AAC{
    PlayerJoin(room: Room_AAC, client: Client, playerData : PlayerInfor_AAC){
        room.state.createPlayer(client.sessionId);
        playerData.SessionId = client.sessionId;
        room.playerInfoDic.Add(client.sessionId, playerData); 
    }

    PlayerLeave(room: Room_AAC, client: Client){
        room.playerInfoDic.Remove(client.sessionId);
        room.playerInfoDic.Remove(client.sessionId);
    }

    PlayerReady(room: Room_AAC, client: Client) {
        var player = room.state.players.get(client.sessionId);
        if (player == null || player == undefined) return;
        player.status = PlayerStatus_AAC.Ready;
        var everyoneReady = true;
        var num = 0;
        room.state.players.forEach(element => {
            num++;
            if(element.status != PlayerStatus_AAC.Ready){
                everyoneReady = false;
                return;
            }
        });
        if(everyoneReady && num == room.maxClients) this.GameStart(room);
    }
    GameStart(room: Room_AAC){
        console.log("GameStart");
        room.lock();
        room.state.status = StateStatus_AAC.Matching;
        room.state.timeTurn = Round.prepare_before_round_start;
        room.state.players.forEach(element => {
            element.gold = Start_Config.Gold;
            element.exp = Start_Config.Exp;
            element.lv = Start_Config.Lv;
        });
    }

    CheckTime(room: Room_AAC){
        if(room.state.timeTurn < 0 && room.state.status == StateStatus_AAC.Matching){
            room.state.status = StateStatus_AAC.Battle;
            room.state.timeTurn = Round.time_roud;
        }
    }
}

export const controller_AAC = new Controller_AAC();