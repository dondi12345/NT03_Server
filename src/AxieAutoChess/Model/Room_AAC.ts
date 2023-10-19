import { Client, Delayed, Room } from "colyseus";
import { NTDictionary } from "../../Utils/NTDictionary";
import { State_AAC } from "./State_AAC";
import { DataModel } from "../../Utils/DataModel";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "./MsgCode_AAC";
import { ChessInShopData_AAC, PlayerChessData_AAC, PlayerData_AAC, PlayerInfo_AAC, PlayerShopData_AAC } from "./PlayerSub_AAC";
import { controller_AAC } from "../Controller/Controller_AAC";
import { logController } from "../../LogServer/Controller/LogController";
import { dataChess } from "../Config/DataChess_AAC";
import { Types } from "mongoose";

export class Room_AAC extends Room<State_AAC> {
    maxClients: number = 1;

    playerInfoDic : NTDictionary<PlayerInfo_AAC>;
    playerDataDic : NTDictionary<PlayerData_AAC>;
    ClientDic : NTDictionary<Client>;
    PlayerChessDataDic : NTDictionary<PlayerChessData_AAC>;

    ShopChess: NTDictionary<ChessInShopData_AAC>;
    ChessOneGold : ChessInShopData_AAC[];
    ChessTwoGold : ChessInShopData_AAC[];
    ChessThreeGold : ChessInShopData_AAC[];
    ChessFourGold : ChessInShopData_AAC[];
    ChessFiveGold : ChessInShopData_AAC[];
    
    delayedInterval!: Delayed;

    onCreate(options: any){
        console.log("Room_AAC created!", options);
        var state = new State_AAC();
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            console.log(client.sessionId, data);
            var message = DataModel.Parse<Message>(data)
            if(message.MessageCode == MsgCode_AAC.Ready){
                controller_AAC.PlayerReady(this, client)
                return;
            }
            if(message.MessageCode == MsgCode_AAC.BuyChess){
                controller_AAC.BuyChess(this, client, message)
                return;
            }
            if(message.MessageCode == MsgCode_AAC.Reset_PlayerShop){
                controller_AAC.ResetPlayerShop(this, client);
                return;
            }
            if(message.MessageCode == MsgCode_AAC.SellChess){
                controller_AAC.SellChess(this, client, message);
                return;
            }
        })
        this.delayedInterval = this.clock.setInterval(() => {
            this.state.timeTurn--;
            controller_AAC.CheckTime(this);
        }, 1000);
        this.InitRoom();
    }

    onJoin (client: Client, options) {
        this.ClientDic.Add(client.sessionId, client);
        console.log(this.ClientDic.Get(client.sessionId).sessionId)
        console.log(client.sessionId + ": Join", options)
        var playerData = DataModel.Parse<PlayerInfo_AAC>(options);
        controller_AAC.PlayerJoin(this, client, playerData);
    }

    onLeave (client) {
        this.ClientDic.Remove(client.sessionId);
        console.log(client.sessionId + ": Left")
        controller_AAC.PlayerLeave(this, client);
    }

    InitRoom(){
        this.playerInfoDic = new NTDictionary<PlayerInfo_AAC>();
        this.ClientDic = new NTDictionary<Client>();
        this.playerDataDic = new NTDictionary<PlayerData_AAC>();
        this.PlayerChessDataDic = new NTDictionary<PlayerChessData_AAC>();
        this.ShopChess = new NTDictionary<ChessInShopData_AAC>();
        this.ChessOneGold = []
        this.ChessTwoGold = []
        this.ChessThreeGold = []
        this.ChessFourGold = []
        this.ChessFiveGold = []
        dataChess.forEach(element => {
            for (let index = 0; index < element.Amount; index++) {
                var chessInShopData = new ChessInShopData_AAC();
                chessInShopData._id = new Types.ObjectId().toString();
                chessInShopData.ParseFromChess(element);
                this.ShopChess.Add(chessInShopData._id, chessInShopData);
                switch (element.Cost) {
                    case 1:
                        this.ChessOneGold.push(chessInShopData);
                        break;
                    case 2:
                        this.ChessTwoGold.push(chessInShopData);
                        break;
                    case 3:
                        this.ChessThreeGold.push(chessInShopData);
                        break;
                    case 4:
                        this.ChessFourGold.push(chessInShopData);
                        break;
                    case 5:
                        this.ChessFiveGold.push(chessInShopData);
                        break;
                }
            }
        });
        console.log(this.ChessOneGold.length, this.ChessTwoGold.length, this.ChessThreeGold.length, this.ChessFourGold.length, this.ChessFiveGold.length)
    }

    sendToAllClient(data){
        this.ClientDic.Keys().forEach(element => {
            this.sendToClient(element, data);
        });
    }

    sendToClient(sessionId : string, data:string){
        this.ClientDic.Get(sessionId).send("message",data);
    }
}