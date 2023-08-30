import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerGuessNumber } from "./PlayerGuessNumber";
import { ClientData, RoomGuessNumberConfig } from "./GuessNumberStateHandler";

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


export class StateGuessNumber extends Schema{
    @type({ map: PlayerGuessNumber })
    players = new MapSchema<PlayerGuessNumber>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string, playerName : string) {
        var playerGuessNumber = new PlayerGuessNumber(); 
        playerGuessNumber.playerName = playerName;
        this.players.set(sessionId, playerGuessNumber);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}
