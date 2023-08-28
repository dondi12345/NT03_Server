import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class RoomGuessNumber extends Schema{
    @type("number")
    timeCount : number = 0;
    @type("number")
    gameStatus : number = 0;
}