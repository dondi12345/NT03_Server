import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

const legthPass = 4;
const maxAnswers = 5;

export class Player extends Schema{
    answers : number[][];
}

export class State extends Schema{
    players = new MapSchema<Player>();
    pass : number[]

    inti(){
        this.pass = [];
        for (let index = 0; index < 4; index++) {
            this.pass.push(Math.floor(Math.random()*10));
        }
        console.log("Pass: ", this.pass);
    }

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    playerAnswer (sessionId: string, answer : number[]) {
        var answers = this.players.get(sessionId)?.answers;
        if(answers == null || answers == undefined){
            answers = [];
        }
        answers.push(answer);
        console.log(sessionId, answers);
    }
}

export class StateHandlerRoom extends Room<State> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());

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