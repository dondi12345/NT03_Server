import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class PlayerGuessNumber extends Schema{
    @type("string")
    correct : string = "";
    @type("number")
    numb : number = 0;
    @type("number")
    score : number = 0;
    @type("number")
    status : number = 0;
}
 