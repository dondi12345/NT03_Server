import { Client } from "colyseus";
import { PlayerStatus_AAC, StateStatus_AAC } from "../Model/Enum_AAC";
import { Room_AAC } from "../Model/Room_AAC";
import { BuyChessData_AAC, ChessData_AAC, ChessInShopData_AAC, PlayerChessData_AAC, PlayerData_AAC, PlayerInfo_AAC, PlayerShopData_AAC, SellChessData_AAC } from "../Model/PlayerSub_AAC";
import { RollingChessData, Round, ShopConfig, Start_Config } from "../Config/Config_AAC";
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
        var chessInShopData = room.ShopChess.Get(buyChessData.ChessId);
        if (chessInShopData == undefined || chessInShopData == null) {
            console.log(buyChessData.ChessId,JSON.stringify(chessInShopData))
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
        playerChessData.Chesses.forEach(element => {
            if(element._id == buyChessData.ChessId){
                messageBack.push(JSON.stringify(BuyChessFailMsg("Chess Owned")));
                var messageData = new MessageData(messageBack)
                room.sendToClient(client.sessionId, JSON.stringify(messageData));
                return;
            }
        });

        var playerData = room.playerDataDic.Get(client.sessionId);
        if (playerData == undefined || playerData == null) {
            messageBack.push(JSON.stringify(BuyChessFailMsg("Not found PlayerData")));
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

        var chessData = service_AAC.chessDataDic.Get(chessInShopData.Index.toString());
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
        room.ShopChess.Remove(buyChessData.ChessId);
        playerData.gold -= chessData.Cost;

        var chess = new ChessData_AAC();
        chess._id = chessInShopData._id;
        chess.Index = chessInShopData.Index;
        chess.Slot = slot;
        playerChessData.Chesses.push(chess);

        var messageBS = new Message();
        messageBS.MessageCode = MsgCode_AAC.BuyChess_Suc;
        messageBS.Data = JSON.stringify(chess);

        var messageUPC = new Message();
        messageUPC.MessageCode = MsgCode_AAC.Update_PlayerChess;
        messageUPC.Data = JSON.stringify(playerChessData);

        var messageUPD = new Message();
        messageUPD.MessageCode = MsgCode_AAC.Update_PlayerData;
        messageUPD.Data = JSON.stringify(playerData);

        messageBack.push(JSON.stringify(messageBS));
        messageBack.push(JSON.stringify(messageUPC));
        messageBack.push(JSON.stringify(messageUPD));

        var messageData = new MessageData(messageBack);
        room.sendToClient(client.sessionId, JSON.stringify(messageData));
    }

    SellChess(room: Room_AAC, client: Client, message: Message) {
        var messageBack: string[] = [];

        var sellChessData = DataModel.Parse<SellChessData_AAC>(message.Data);

        var playerChessData = room.PlayerChessDataDic.Get(client.sessionId);
        if (playerChessData == undefined || playerChessData == null) {
            var messageData = new MessageData([JSON.stringify(SellChessFailMsg("Not found PlayerChess"))])
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }
        var playerData = room.playerDataDic.Get(client.sessionId);
        if (playerData == undefined || playerData == null) {
            var messageData = new MessageData([JSON.stringify(SellChessFailMsg("Not found PlayerData"))])
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }
        for (let index = 0; index < playerChessData.Chesses.length; index++) {
            const element = playerChessData.Chesses[index];
            if (element._id == sellChessData.ChessId) {
                var chess = service_AAC.chessDataDic.Get(element.Index.toString());
                if (chess == null || chess == undefined) {
                    var messageData = new MessageData([JSON.stringify(SellChessFailMsg("Not found chessData"))])
                    room.sendToClient(client.sessionId, JSON.stringify(messageData));
                    return;
                }

                var amountChess = 1;
                if (element.Star == 2) amountChess = 3;
                else if (element.Star == 3) amountChess = 9;

                for (let index = 0; index < amountChess; index++) {
                    var chessInShopData = new ChessInShopData_AAC();
                    chessInShopData._id = new Types.ObjectId().toString();
                    chessInShopData.Index = element.Index;
                    room.ShopChess.Add(chessInShopData._id, chessInShopData);
                    switch (chess.Cost) {
                        case 5:
                            room.ChessFiveGold.push(chessInShopData);
                            break;
                        case 4:
                            room.ChessFourGold.push(chessInShopData);
                            break;
                        case 3:
                            room.ChessThreeGold.push(chessInShopData);
                            break;
                        case 2:
                            room.ChessTwoGold.push(chessInShopData);
                            break;
                        default:
                            room.ChessOneGold.push(chessInShopData);
                            break;
                    }
                }

                playerChessData.Chesses.splice(index, 1);
                playerData.gold += FomuaChessCost(chess.Cost, element.Star);

                var messageUPC = new Message();
                messageUPC.MessageCode = MsgCode_AAC.Update_PlayerChess;
                messageUPC.Data = JSON.stringify(playerChessData);

                var messageUPD = new Message();
                messageUPD.MessageCode = MsgCode_AAC.Update_PlayerData;
                messageUPD.Data = JSON.stringify(playerData);

                messageBack.push(JSON.stringify(messageUPC));
                messageBack.push(JSON.stringify(messageUPD));

                var messageData = new MessageData(messageBack);
                room.sendToClient(client.sessionId, JSON.stringify(messageData));
                return;
            }
        }
        var messageData = new MessageData([JSON.stringify(SellChessFailMsg("Not found Chess"))])
        room.sendToClient(client.sessionId, JSON.stringify(messageData));
    }
    ResetPlayerShop(room: Room_AAC, client: Client) {
        var messageBack: string[] = [];
        var playerData = room.playerDataDic.Get(client.sessionId);
        if (playerData == null || playerData == undefined) {
            var messageData = new MessageData([JSON.stringify(ResetShopFailMsg("Not found playerData"))])
            room.sendToClient(client.sessionId, JSON.stringify(messageData));
            return;
        }
        if (ShopConfig.ResetCost > playerData.gold) {
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
        playerShopData.Chesses = GetRandomChessForShop(room, client.sessionId, playerData.lv);
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
            let playerData: PlayerData_AAC = room.playerDataDic.Get(element);
            playerData.gold = Start_Config.Gold;
            playerData.exp = Start_Config.Exp;
            playerData.lv = Start_Config.Lv;

            var messageUP = new Message();
            messageUP.MessageCode = MsgCode_AAC.Update_PlayerData;
            messageUP.Data = JSON.stringify(playerData);

            var playerShopData = new PlayerShopData_AAC();
            playerShopData.SessionId = element;
            playerShopData.Chesses = GetRandomChessForShop(room, playerData.SessionId, playerData.lv);
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

function GetRandomChessForShop(room: Room_AAC, sessionId: string, lv: number) {
    var rollingData = RollingChessData[lv];
    var chessDatas: ChessData_AAC[] = [];
    room.ShopChess.Keys().forEach(element => {
        var chessInShopData = room.ShopChess.Get(element);
        if (chessInShopData.Player == sessionId) {
            chessInShopData.Player = "";
            var chess = service_AAC.chessDataDic.Get(chessInShopData.Index.toString());
            room.ShopChess.Add(chessInShopData._id, chessInShopData);
            switch (chess.Cost) {
                case 5:
                    room.ChessFiveGold.push(chessInShopData);
                    break;
                case 4:
                    room.ChessFourGold.push(chessInShopData);
                    break;
                case 3:
                    room.ChessThreeGold.push(chessInShopData);
                    break;
                case 2:
                    room.ChessTwoGold.push(chessInShopData);
                    break;
                default:
                    room.ChessOneGold.push(chessInShopData);
                    break;
            }
        }
    });
    for (let i = 0; i < ShopConfig.Amount; i++) {
        var rand = Math.random();
        var chessData = new ChessData_AAC();
        if (rand < rollingData.FiveGold && room.ChessFiveGold.length > 0) {
            var index = Math.floor(Math.random() * room.ChessFiveGold.length);
            var chessInShopData = room.ChessFiveGold[index];
            room.ChessFiveGold.splice(index, 1);
            room.ShopChess.Get(chessInShopData._id).Player = sessionId;
            chessData._id = chessInShopData._id;
            chessData.Index = chessInShopData.Index;
            chessData.Slot = i;
            chessDatas.push(chessData)
        } else if (rand < (rollingData.FiveGold + rollingData.FourGold) && room.ChessFourGold.length > 0) {
            var index = Math.floor(Math.random() * room.ChessFourGold.length);
            var chessInShopData = room.ChessFourGold[index];
            room.ChessFourGold.splice(index, 1);
            room.ShopChess.Get(chessInShopData._id).Player = sessionId;
            chessData._id = chessInShopData._id;
            chessData.Index = chessInShopData.Index;
            chessData.Slot = i;
            chessDatas.push(chessData)
        } else if (rand < (rollingData.FiveGold + rollingData.FourGold + rollingData.ThreeGold) && room.ChessThreeGold.length > 0) {
            var index = Math.floor(Math.random() * room.ChessThreeGold.length);
            var chessInShopData = room.ChessThreeGold[index];
            room.ChessThreeGold.splice(index, 1);
            room.ShopChess.Get(chessInShopData._id).Player = sessionId;
            chessData._id = chessInShopData._id;
            chessData.Index = chessInShopData.Index;
            chessData.Slot = i;
            chessDatas.push(chessData)
        } else if (rand < (rollingData.FiveGold + rollingData.FourGold + rollingData.ThreeGold + rollingData.TwoGold) && room.ChessTwoGold.length > 0) {
            var index = Math.floor(Math.random() * room.ChessTwoGold.length);
            var chessInShopData = room.ChessTwoGold[index];
            room.ChessTwoGold.splice(index, 1);
            room.ShopChess.Get(chessInShopData._id).Player = sessionId;
            chessData._id = chessInShopData._id;
            chessData.Index = chessInShopData.Index;
            chessData.Slot = i;
            chessDatas.push(chessData)
        } else {
            var index = Math.floor(Math.random() * room.ChessOneGold.length);
            var chessInShopData = room.ChessOneGold[index];
            room.ChessOneGold.splice(index, 1);
            room.ShopChess.Get(chessInShopData._id).Player = sessionId;
            chessData._id = chessInShopData._id;
            chessData.Index = chessInShopData.Index;
            chessData.Slot = i;
            chessDatas.push(chessData)
        }
    }
    console.log(room.ChessOneGold.length, room.ChessTwoGold.length, room.ChessThreeGold.length, room.ChessFourGold.length, room.ChessFiveGold.length)
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
function SellChessFailMsg(error: string) {
    var message = new Message();
    message.MessageCode = MsgCode_AAC.SellChess_Fail;
    message.Data = error;
    return message;
}

function FomuaChessCost(baseCost: number, star: number) {
    return baseCost * star;
}