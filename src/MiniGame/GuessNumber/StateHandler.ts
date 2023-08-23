import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

const legthPass = 4;
const maxAnswers = 5;

export class PlayerGuessNumber extends Schema{
    @type("string")
    answers : string = "";
    @type("number")
    numb : number = 0;
}

export class StateGuessNumber extends Schema{
    @type({ map: PlayerGuessNumber })
    players = new MapSchema<PlayerGuessNumber>();
    @type("string")
    pass : string

    something = "This attribute won't be sent to the client-side";

    inti(){
        this.pass = ""
        for (let index = 0; index < 4; index++) {
            this.pass += (Math.floor(Math.random()*10));
        }
        console.log("Pass: ", this.pass);
    }

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new PlayerGuessNumber());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    playerAnswer (sessionId: string, answer : string = "") {
        var player = this.players.get(sessionId);
        if(player == null || player == undefined){
            console.log("Not found: "+sessionId)
        }else{
            player.answers = answer;
            this.players.get(sessionId)!.numb ++;
            console.log(sessionId, this.players.get(sessionId)?.answers);
            this.Log();
            this.players.set(sessionId, player!);
        }
    }

    Log(){
        this.players.forEach(element => {
            console.log(element.numb);
        });
    }
}

export class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients = 2;
    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        var state = new StateGuessNumber();
        state.inti()
        this.setState(state);
        this.onMessage("answer", (client, data) => {
            console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
            this.state.playerAnswer(client.sessionId, data);
        });
    }
    
    onJoin (client: Client) {
        // client.send("hello", "world");
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
