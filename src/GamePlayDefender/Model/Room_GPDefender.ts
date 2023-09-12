import { Room, Client, Delayed } from "colyseus";
import { State_GPDefender } from "./State_GPDefender";
import { logController } from "../../LogServer/Controller/LogController";
import { DataModel } from "../../Utils/DataModel";
import { Message } from "../../MessageServer/Model/Message";
import { router_GPDefender } from "../Router/Router_GPDefender";
import { controller_GPDefender } from "../Controller/Controller__GPDefender";
import { MonsterBot_GPDefender } from "../Controller/MonsterBot_GPDefender";

export const TimeDela = 0.5;

export class Room_GPDefender extends Room<State_GPDefender> {
    slot1 : string = "";
    slot2 : string = "";
    maxClients: number = 2;
    curClients = 0;
    monsterBot : MonsterBot_GPDefender;


    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        var state = new State_GPDefender();
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            logController.LogDev("Dev Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            router_GPDefender.Router(message, this);
        })
        this.monsterBot = new MonsterBot_GPDefender();
        this.monsterBot.Init(this);
        this.Update();
    }

    Update() {
        this.state.time += TimeDela;
        this.monsterBot.Update();
        setTimeout(() => {
            this.Update();
        }, TimeDela*1000)
    }

    onJoin (client: Client, options) {
        logController.LogDev("Dev", options.name_player, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.name_player);
        controller_GPDefender.PutPlayer(client.sessionId, this);
        this.curClients ++;
    }

    onLeave (client) {
        logController.LogDev("Dev", client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
        controller_GPDefender.RemoveSlot(client.sessionId, this);
        this.curClients --;
        if(this.curClients <= 0){
            this.state.bullets.clear();
            this.state.monsters.clear();
        }
    }

    onDispose () {
        logController.LogDev("Dev Dispose StateHandlerRoom");
    }
}