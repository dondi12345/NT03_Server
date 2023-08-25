import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { StateGuessNumber } from "./StateGuessNumber";
import { guessNumberService } from "../GuessNumberService";
import { guessNumberRouter } from "../Router/GuessNumberRouter";
import { DataModel } from "../../../Utils/DataModel";
import { Message } from "./Message";

export class ClientData{
    client : Client;
    hisAnswer : string [] = [];
    hisResult : string [] = [];
}
export type DataHeroDictionary = Record<string, ClientData>;
export class RoomGuessNumberData{
    pass : string;
    legthPass : number;
    maxAnswers : number;
}

export class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients = 2;

    clientDatas : DataHeroDictionary
    roomData : RoomGuessNumberData;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessNumber();
        this.clientDatas = {}
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            console.log("Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            guessNumberRouter.Router(this, message, client.sessionId);
        })
    }

    sendClientDataToClient(sessionId){
        var clientData = this.clientDatas[sessionId];
        console.log(clientData);
        clientData.client.send("getData", JSON.stringify(clientData));
    }

    inti(){
        this.roomData = new RoomGuessNumberData();
        this.roomData.legthPass = 4;
        this.roomData.maxAnswers = 5;
        this.roomData.pass = "";
        switch (this.roomData.legthPass) {
            default:
                this.roomData.pass = guessNumberService.fourWord[Math.floor(Math.random()*guessNumberService.fourWord.length)];
                break;
        }
        console.log("Pass: ", this.roomData.pass);
    }
    
    onJoin (client: Client, options) {
        var clientData = new ClientData();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        console.log(client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        console.log(client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}