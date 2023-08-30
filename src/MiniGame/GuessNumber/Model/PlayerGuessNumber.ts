import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class PlayerGuessNumber extends Schema{
    @type("string")
    playerName : string = "";
    @type("string")
    correct : string = "";
    @type("number")
    numb : number = 0;
    @type("number")
    score : number = 0;
    @type("number")
    status : number = 0;

    resetData(){
        this.correct = "";
        this.numb = 0;
        this.score = 0;
        this.status = 0;
    }
}
 