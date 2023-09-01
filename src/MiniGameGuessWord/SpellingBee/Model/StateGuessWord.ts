import { Schema, Context, MapSchema } from "@colyseus/schema";
import { PlayerSpellingBee } from "./PlayerSpellingBee";
const type = Context.create(); // this is your @type() decorator bound to a context

export class StateGuessWord extends Schema{
    @type({ map: PlayerSpellingBee })
    players = new MapSchema<PlayerSpellingBee>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string, playerName : string) {
        var playerGuessWord = new PlayerSpellingBee();
        playerGuessWord.playerName = playerName;
        this.players.set(sessionId, playerGuessWord);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}
