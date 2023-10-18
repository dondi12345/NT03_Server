import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { ChessData_AAC, PlayerChessData_AAC, PlayerData_AAC, PlayerInfo_AAC, PlayerShopData_AAC } from "../Model/PlayerSub_AAC";
import { Round, ShopChess, Start_Config } from "../Config/Config_AAC";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "../Model/MsgCode_AAC";
import { Types } from "mongoose";

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

        var playerChessData = new PlayerChessData_AAC();
        playerChessData.SessionId = client.sessionId;
        room.PlayerChessDataDic.Add(client.sessionId, playerChessData);

        var playerShopData = new PlayerShopData_AAC();
        playerShopData.SessionId = client.sessionId;
        room.PlayerShopDataDic.Add(client.sessionId, playerShopData);
    }

    PlayerLeave(room: Room_AAC, client: Client){
        if(room.state.status == StateStatus_AAC.Lobby){
            room.playerInfoDic.Remove(client.sessionId);
            room.playerDataDic.Remove(client.sessionId);
            room.ClientDic.Remove(client.sessionId);
            room.PlayerChessDataDic.Remove(client.sessionId);
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

            var messageUP = new Message();
            messageUP.MessageCode = MsgCode_AAC.Update_PlayerData;
            messageUP.Data = JSON.stringify(value);
            
            var playerShopData = new PlayerShopData_AAC();
            playerShopData.SessionId = element;
            playerShopData.Chesses = GetRandomChessForShop();
            room.PlayerShopDataDic.Add(element, playerShopData);
            var messageUS = new Message();
            messageUS.MessageCode = MsgCode_AAC.Update_PlayerShop;
            messageUS.Data = JSON.stringify(playerShopData);

            var messageData = new MessageData([JSON.stringify(messageUP), JSON.stringify(messageUS)]);
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

function GetRandomChessForShop(){
    var chessDatas : ChessData_AAC[] = [];
    for (let i = 0; i < 4; i++) {
        var index = ShopChess[Math.floor(Math.random()*ShopChess.length)];
        var chessData = new ChessData_AAC();
        chessData._id = new Types.ObjectId().toString();
        chessData.Index = index;
        chessDatas.push(chessData);
    }
    return chessDatas;
}