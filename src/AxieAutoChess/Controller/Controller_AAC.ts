import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { BuyChessData_AAC, ChessData_AAC, PlayerChessData_AAC, PlayerData_AAC, PlayerInfo_AAC, PlayerShopData_AAC } from "../Model/PlayerSub_AAC";
import { Round, ShopChess, ShopConfig, Start_Config } from "../Config/Config_AAC";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "../Model/MsgCode_AAC";
import { Types } from "mongoose";
import { DataModel } from "../../Utils/DataModel";
import { service_AAC } from "../Service/Service_AAC";

class Controller_AAC {
    PlayerJoin(room: Room_AAC, client: Client, playerInfo: PlayerInfo_AAC) {
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

    PlayerLeave(room: Room_AAC, client: Client) {
        if (room.state.status == StateStatus_AAC.Lobby) {
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
            if (element.status != PlayerStatus_AAC.Ready) {
                everyoneReady = false;
                return;
            }
        });
        if (everyoneReady && num == room.maxClients) this.GameStart(room);
    }
    BuyChess(room: Room_AAC, client: Client, message: Message) {
        var messageBack: string[] = [];

        var buyChessData = DataModel.Parse<BuyChessData_AAC>(message.Data);
        var playerShopData = room.PlayerShopDataDic.Get(client.sessionId);
        if (playerShopData == undefined || playerShopData == null) {
            messageBack.push(JSON.stringify(BuyChessFailMsg("Not found ChessShop")));
            var messageData = new MessageData(messageBack)
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }

        var playerChessData = room.PlayerChessDataDic.Get(client.sessionId);
        if (playerChessData == undefined || playerChessData == null) {
            messageBack.push(JSON.stringify(BuyChessFailMsg("Not found PlayerChess")));
            var messageData = new MessageData(messageBack)
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }

        var slot = -1;
        for (let index = 0; index < 9; index++) {
            var able = true;
            playerChessData.Chesses.forEach(element => {
                if (element.IsUse == false && element.Slot == index) {
                    able = false;
                    return;
                }
            });
            if (able) {
                slot = index;
                break;
            }
        }
        if (slot == -1) {
            messageBack.push(JSON.stringify(BuyChessFailMsg("Cap slot in deck")));
            var messageData = new MessageData(messageBack)
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }

        var playerData = room.playerDataDic.Get(client.sessionId);
        if (playerData == undefined || playerData == null) {
            messageBack.push(JSON.stringify(BuyChessFailMsg("Not found PlayerData")));
            var messageData = new MessageData(messageBack)
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }

        var chess: ChessData_AAC | undefined;
        for (let index = 0; index < playerShopData.Chesses.length; index++) {
            const element = playerShopData.Chesses[index];
            if (element._id == buyChessData.ChessId) {
                var chessData = service_AAC.chessDataDic.Get(element.Index.toString());
                if (chessData == null || chessData == undefined) {
                    messageBack.push(JSON.stringify(BuyChessFailMsg("Not found ChessData")));
                    var messageData = new MessageData(messageBack)
                    room.sendToClient(client.sessionId, JSON.stringify(messageData));
                    return;
                }
                if (chessData.Cost > playerData.gold) {
                    messageBack.push(JSON.stringify(BuyChessFailMsg("Not enought money")));
                    var messageData = new MessageData(messageBack)
                    room.sendToClient(client.sessionId, JSON.stringify(messageData));
                    return;
                }
                playerData.gold -= chessData.Cost;
                chess = element;
                playerShopData.Chesses.splice(index, 1);
                break;
            }
        }
        if (chess == null || chess == undefined) {
            return;
        }
        chess.Slot = slot;
        playerChessData.Chesses.push(chess);

        var messageBS = new Message();
        messageBS.MessageCode = MsgCode_AAC.BuyChess_Suc;
        messageBS.Data = JSON.stringify(chess);

        var messageUS = new Message();
        messageUS.MessageCode = MsgCode_AAC.Update_PlayerShop;
        messageUS.Data = JSON.stringify(playerShopData);

        var messageUPC = new Message();
        messageUPC.MessageCode = MsgCode_AAC.Update_PlayerChess;
        messageUPC.Data = JSON.stringify(playerChessData);

        var messageUPD = new Message();
        messageUPD.MessageCode = MsgCode_AAC.Update_PlayerData;
        messageUPD.Data = JSON.stringify(playerData);

        messageBack.push(JSON.stringify(messageBS));
        messageBack.push(JSON.stringify(messageUS));
        messageBack.push(JSON.stringify(messageUPC));
        messageBack.push(JSON.stringify(messageUPD));

        var messageData = new MessageData(messageBack);
        room.sendToClient(client.sessionId, JSON.stringify(messageData));
    }
    ResetPlayerShop(room: Room_AAC, client: Client) {
        var messageBack: string[] = [];
        var playerData = room.playerDataDic.Get(client.sessionId);
        if(playerData == null || playerData == undefined){
            var messageData = new MessageData([JSON.stringify(ResetShopFailMsg("Not found playerData"))])
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }
        if(ShopConfig.ResetCost > playerData.gold){
            var messageData = new MessageData([JSON.stringify(ResetShopFailMsg("Not enought gold"))])
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }
        playerData.gold -= ShopConfig.ResetCost;
        var messageUPD = new Message();
        messageUPD.MessageCode = MsgCode_AAC.Update_PlayerData;
        messageUPD.Data = JSON.stringify(playerData)

        var playerShopData = new PlayerShopData_AAC();
        playerShopData.SessionId = client.sessionId;
        playerShopData.Chesses = GetRandomChessForShop();
        room.PlayerShopDataDic.Add(client.sessionId, playerShopData);
        var messageUS = new Message();
        messageUS.MessageCode = MsgCode_AAC.Update_PlayerShop;
        messageUS.Data = JSON.stringify(playerShopData);

        messageBack.push(JSON.stringify(messageUS));
        messageBack.push(JSON.stringify(messageUPD));

        var messageData = new MessageData(messageBack);
        room.sendToClient(client.sessionId, JSON.stringify(messageData));

    }

    GameStart(room: Room_AAC) {
        console.log("GameStart");
        room.lock();
        room.state.status = StateStatus_AAC.Matching;
        room.state.timeTurn = Round.prepare_before_round_start;
        room.playerDataDic.Keys().forEach(element => {
            let value: PlayerData_AAC = room.playerDataDic.Get(element);
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

    CheckTime(room: Room_AAC) {
        if (room.state.timeTurn < 0 && room.state.status == StateStatus_AAC.Matching) {
            room.state.status = StateStatus_AAC.Battle;
            room.state.timeTurn = Round.time_roud;
        }
    }
}

export const controller_AAC = new Controller_AAC();

function GetRandomChessForShop() {
    var chessDatas: ChessData_AAC[] = [];
    for (let i = 0; i < 4; i++) {
        var index = ShopChess[Math.floor(Math.random() * ShopChess.length)];
        var chessData = new ChessData_AAC();
        chessData._id = new Types.ObjectId().toString();
        chessData.Index = index;
        chessDatas.push(chessData);
    }
    return chessDatas;
}

function BuyChessFailMsg(error: string) {
    var message = new Message();
    message.MessageCode = MsgCode_AAC.BuyChess_Fail;
    message.Data = error;
    return message;
}

function ResetShopFailMsg(error: string) {
    var message = new Message();
    message.MessageCode = MsgCode_AAC.Reset_PlayerShop_Fail;
    message.Data = error;
    return message;
}