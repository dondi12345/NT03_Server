import { Client, Room } from "colyseus";
import { State_C4PE } from "./State_C4PE";
import { PlayerDataJoin_C4PE, PlayerData_C4PE } from "./PlayerData_C4PE";
import { DataModel } from "../../Utils/DataModel";
import { controller_C4PE } from "../Controller/Controller_C4PE";
import { Message } from "../../MessageServer/Model/Message";
import { MsgCode_C4PE } from "./MsgCode_C4PE";
import { NTDictionary } from "../../Utils/NTDictionary";

export class Room_C4PE extends Room<State_C4PE> {
    maxClients: number = 2;

    playerDataDic : NTDictionary<PlayerData_C4PE>;

    onCreate(options: any){
        console.log("Room_C4PE created!", options);
        var state = new State_C4PE();
        this.playerDataDic = new NTDictionary<PlayerData_C4PE>();
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            console.log(client.sessionId, data);
            var message = DataModel.Parse<Message>(data)
            if(message.MessageCode == MsgCode_C4PE.Ready){
                controller_C4PE.PlayerReady(this, client)
                return;
            }
        })
    }

    onJoin (client: Client, options) {
        console.log(client.sessionId + ": Join", options)
        var playerDataJoin = DataModel.Parse<PlayerDataJoin_C4PE>(options.PlayerDataJoin);
        controller_C4PE.PlayerJoin(this, client, playerDataJoin);
    }

    onLeave (client) {
        console.log(client.sessionId + ": Left")
        controller_C4PE.PlayerLeave(this, client);
    }
}