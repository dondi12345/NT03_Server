import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { StateGuessNumber } from "./StateGuessNumber";
import { guessNumberService } from "./GuessNumberService";

class ClientData{
    client : Client;
    data : string;
}

export class RoomGuessNumberData{
    pass : string;
    legthPass : number;
    maxAnswers : number;
}

export class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients = 2;
    clientDatas : ClientData[]
    roomGuessNumberData : RoomGuessNumberData;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessNumber();
        this.setState(state);
        this.onMessage("answer", (client, data) => {
            console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
            this.state.playerAnswer(client.sessionId, data, this.roomGuessNumberData)
        });
    }

    inti(){
        this.roomGuessNumberData = new RoomGuessNumberData();
        this.roomGuessNumberData.legthPass = 4;
        this.roomGuessNumberData.maxAnswers = 5;
        this.roomGuessNumberData.pass = "";
        switch (this.roomGuessNumberData.legthPass) {
            default:
                this.roomGuessNumberData.pass = guessNumberService.fourWord[Math.floor(Math.random()*guessNumberService.fourWord.length)];
                break;
        }
        console.log("Pass: ", this.roomGuessNumberData.pass);
    }
    
    onJoin (client: Client, options) {
        // client.send("hello", "world");
        // var clientData = new ClientData();
        // clientData.client = client;
        // clientData.data = client.sessionId;
        // this.clientDatas.push(clientData);
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