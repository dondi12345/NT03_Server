import { Room, Client } from "colyseus";
import { Schema, Context, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player_C4PE } from "./Player_C4PE";
import { PlayerDataJoin_C4PE } from "./PlayerData_C4PE";
const type = Context.create(); // this is your @type() decorator bound to a context

export class State_C4PE extends Schema{
    @type({ map: Player_C4PE })
    players = new MapSchema<Player_C4PE>();
    @type("number")
    timeTurn : number = 0;

    createPlayer(sessionId: string) {
        var player_C4PE = new Player_C4PE();
        this.players.set(sessionId, player_C4PE);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}
