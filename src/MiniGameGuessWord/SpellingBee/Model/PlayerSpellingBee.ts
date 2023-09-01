import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context
export class PlayerSpellingBee extends Schema{
    @type("string")
    playerName : string = "";
    @type("string")
    score : number = 0;

    resetData(){
        this.score = 0;
    }
}
