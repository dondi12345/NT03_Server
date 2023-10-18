import { Room, Client } from "colyseus";
import { Schema, Context, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player_AAC } from "./Player_AAC";
const type = Context.create(); // this is your @type() decorator bound to a context

export class State_AAC extends Schema{
    @type("number")
    status : number = 0;
    @type({ map: Player_AAC })
    players = new MapSchema<Player_AAC>();
    @type("number")
    timeTurn : number = 0;

    createPlayer(sessionId: string) {
        var player_AAC = new Player_AAC();
        this.players.set(sessionId, player_AAC);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}