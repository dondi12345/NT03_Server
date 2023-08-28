import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerGuessNumber } from "./PlayerGuessNumber";
import { ClientData, RoomGuessNumberData } from "./GuessNumberStateHandler";
import { RoomGuessNumber } from "./RoomGuessNumber";

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
    @type(RoomGuessNumber)
    room : RoomGuessNumber = new RoomGuessNumber();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new PlayerGuessNumber());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}
