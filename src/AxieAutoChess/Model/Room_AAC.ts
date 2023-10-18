import { Client, Delayed, Room } from "colyseus";
import { NTDictionary } from "../../Utils/NTDictionary";
import { State_AAC } from "./State_AAC";
import { DataModel } from "../../Utils/DataModel";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "./MsgCode_AAC";
import { ChessInDeck, ChessInFeild, PlayerData_AAC, PlayerInfo_AAC } from "./PlayerSub_AAC";
import { controller_AAC } from "../Controller/Controller_AAC";
import { logController } from "../../LogServer/Controller/LogController";

export class Room_AAC extends Room<State_AAC> {
    maxClients: number = 1;

    playerInfoDic : NTDictionary<PlayerInfo_AAC>;
    playerDataDic : NTDictionary<PlayerData_AAC>;
    ClientDic : NTDictionary<Client>;
    ChessInFeildDic : NTDictionary<ChessInFeild>;
    ChessInDeckDic : NTDictionary<ChessInDeck>;
    
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
        this.ChessInFeildDic = new NTDictionary<ChessInFeild>();
        this.ChessInDeckDic = new NTDictionary<ChessInDeck>();
        this.playerDataDic = new NTDictionary<PlayerData_AAC>();
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