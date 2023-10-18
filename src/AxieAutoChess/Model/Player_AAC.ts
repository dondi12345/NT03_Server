import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context


export class Player_AAC extends Schema{
    @type("number")
    status: number = 0;
    @type("number")
    gold: number = 0;
    @type("number")
    exp: number = 0;
    @type("number")
    lv: number = 0;
}