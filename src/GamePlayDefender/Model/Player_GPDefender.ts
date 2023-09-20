import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context
export class Player_GPDefender extends Schema{
    @type("string")
    name_player : string = "";

    @type("number")
    x = 0.0;
    @type("number")
    y = 0.0;
    @type("number")
    z = 0.0;

    @type("number")
    r_x = 0.0;
    @type("number")
    r_y = 0.0;
    @type("number")
    r_z = 0.0;

    @type("number")
    d_x = 0.0;
    @type("number")
    d_y = 0.0;
    @type("number")
    d_z = 0.0;

    @type("number")
    d_r_x = 0.0;
    @type("number")
    d_r_y = 0.0;
    @type("number")
    d_r_z = 0.0;

    @type("number")
    index_gun = 0.0;
}
