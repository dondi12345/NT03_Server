import { Room, Client, Delayed } from "colyseus";
import { State_GPDefender } from "./State_GPDefender";
import { logController } from "../../LogServer/Controller/LogController";
import { DataModel } from "../../Utils/DataModel";
import { Message } from "../../MessageServer/Model/Message";
import { router_GPDefender } from "../Router/Router_GPDefender";
import { controller__GPDefender } from "../Controller/Controller__GPDefender";

export class Room_GPDefender extends Room<State_GPDefender> {
    slot1 : string = "";
    slot2 : string = "";
    

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        var state = new State_GPDefender();
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            logController.LogDev("Dev Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            router_GPDefender.Router(message, this);
        })
    }

    onJoin (client: Client, options) {
        logController.LogDev("Dev", options.name_player, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.name_player);
        controller__GPDefender.PutPlayer(client.sessionId, this);
    }

    onLeave (client) {
        logController.LogDev("Dev", client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
        controller__GPDefender.RemoveSlot(client.sessionId, this);
    }

    onDispose () {
        logController.LogDev("Dev Dispose StateHandlerRoom");
    }
}