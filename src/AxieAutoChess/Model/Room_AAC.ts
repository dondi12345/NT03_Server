import { Client, Delayed, Room } from "colyseus";
import { NTDictionary } from "../../Utils/NTDictionary";
import { State_AAC } from "./State_AAC";
import { DataModel } from "../../Utils/DataModel";
import { Message, MessageData } from "../../MessageServer/Model/Message";
import { MsgCode_AAC } from "./MsgCode_AAC";
import { PlayerInfor_AAC } from "./PlayerSub_AAC";
import { controller_AAC } from "../Controller/Controller_AAC";
import { logController } from "../../LogServer/Controller/LogController";

export class Room_AAC extends Room<State_AAC> {
    maxClients: number = 1;

    playerInfoDic : NTDictionary<PlayerInfor_AAC>;
    ClientDic : NTDictionary<Client>;
    
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
        console.log(client.sessionId + ": Join", options)
        var playerData = DataModel.Parse<PlayerInfor_AAC>(options);
        controller_AAC.PlayerJoin(this, client, playerData);
    }

    onLeave (client) {
        this.ClientDic.Remove(client.sessionId);
        console.log(client.sessionId + ": Left")
        controller_AAC.PlayerLeave(this, client);
    }

    InitRoom(){
        this.playerInfoDic = new NTDictionary<PlayerInfor_AAC>();
        this.ClientDic = new NTDictionary<Client>();
    }

    sendToAllClient(...message: string[]){
        for(let key in this.playerInfoDic){
            try {
                var messageData = new MessageData(message);
                logController.LogDev("Dev", JSON.stringify(messageData))
                this.sendToClient(JSON.stringify(messageData), key);
            } catch (error) {
                logController.LogDev("Dev error:", error)
            }
        }
    }

    sendToClient(data:string, sessionId : string){
        this.ClientDic.Get(sessionId).send(data);
    }
}