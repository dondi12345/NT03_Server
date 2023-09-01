import { Room, Client } from "colyseus";
import { Schema, Context, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerGuessWord } from "./PlayerGuessWord";
import { ClientData, RoomGuessWordConfig } from "./GuessWordStateHandler";
const type = Context.create(); // this is your @type() decorator bound to a context
const Ans = {
    correct : "2",
    correctNumber : "1",
    wrong :  "0"
}

export const StatusPlayer = {
    Lose : -1,
    Do : 0,
    Win : 1,
}


export class StateGuessWord extends Schema{
    @type({ map: PlayerGuessWord })
    players = new MapSchema<PlayerGuessWord>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string, playerName : string) {
        var playerGuessWord = new PlayerGuessWord();
        playerGuessWord.playerName = playerName;
        this.players.set(sessionId, playerGuessWord);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}
