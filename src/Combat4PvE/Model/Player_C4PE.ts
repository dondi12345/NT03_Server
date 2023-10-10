import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context

export class Player_C4PE extends Schema {
    @type("number")
    state: number = 0;
    @type("number")
    curHP: number = 0;
    @type("number")
    curMP: number = 0;
}
