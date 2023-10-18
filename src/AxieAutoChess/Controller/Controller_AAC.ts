import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { ChessInFeild, PlayerData_AAC, PlayerInfo_AAC } from "../Model/PlayerSub_AAC";
import { Round, Start_Config } from "../Config/Config_AAC";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "../Model/MsgCode_AAC";

class Controller_AAC{
    PlayerJoin(room: Room_AAC, client: Client, playerInfo : PlayerInfo_AAC){
        room.state.createPlayer(client.sessionId);

        playerInfo.SessionId = client.sessionId;
        room.playerInfoDic.Add(client.sessionId, playerInfo);

        var message = new Message();
        message.MessageCode = MsgCode_AAC.Update_PlayerInfo;
        message.Data = JSON.stringify(playerInfo);
        var messageData = new MessageData([JSON.stringify(message)]);
        
        room.sendToAllClient(JSON.stringify(messageData));

        var playerData = new PlayerData_AAC();
        playerData.SessionId = client.sessionId;
        room.playerDataDic.Add(client.sessionId, playerData);

        var chessInFeild = new ChessInFeild();
        chessInFeild.SessionId = client.sessionId;
        room.ChessInFeildDic.Add(client.sessionId, chessInFeild);
    }

    PlayerLeave(room: Room_AAC, client: Client){
        if(room.state.status == StateStatus_AAC.Lobby){
            room.playerInfoDic.Remove(client.sessionId);
            room.playerDataDic.Remove(client.sessionId);
            room.ClientDic.Remove(client.sessionId);
            room.ChessInFeildDic.Remove(client.sessionId);
        }
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
        room.playerDataDic.Keys().forEach(element=>{
            let value : PlayerData_AAC = room.playerDataDic.Get(element);
            value.gold = Start_Config.Gold;
            value.exp = Start_Config.Exp;
            value.lv = Start_Config.Lv;
            var message = new Message();
            message.MessageCode = MsgCode_AAC.Update_PlayerData;
            message.Data = JSON.stringify(value);
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(element, JSON.stringify(messageData));
        })
    }

    CheckTime(room: Room_AAC){
        if(room.state.timeTurn < 0 && room.state.status == StateStatus_AAC.Matching){
            room.state.status = StateStatus_AAC.Battle;
            room.state.timeTurn = Round.time_roud;
        }
    }
}

export const controller_AAC = new Controller_AAC();