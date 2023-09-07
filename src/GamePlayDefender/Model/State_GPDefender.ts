import { Schema, Context, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player_GPDefender } from "./Player_GPDefender";
const type = Context.create(); 

export class State_GPDefender extends Schema{
    @type({ map: Player_GPDefender })
    players = new MapSchema<Player_GPDefender>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string, name_player : string) {
        var player = new Player_GPDefender();
        player.name_player = name_player;
        this.players.set(sessionId, player);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}