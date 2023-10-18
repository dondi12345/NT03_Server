import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { PlayerData_AAC } from "../Model/PlayerData_AAC";

class Controller_AAC{
    PlayerJoin(room: Room_AAC, client: Client, playerData : PlayerData_AAC){
        room.state.createPlayer(client.sessionId);
        playerData.SessionId = client.sessionId;
        room.playerDataDic.Add(client.sessionId, playerData); 
    }

    PlayerLeave(room: Room_AAC, client: Client){
        room.playerDataDic.Remove(client.sessionId);
        room.playerDataDic.Remove(client.sessionId);
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
    }
}

export const controller_AAC = new Controller_AAC();