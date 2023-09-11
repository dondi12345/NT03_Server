import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context

export class BulletData_GPDefender{
    bullet_id : string = "";
    player_id : string = "";
    bullet_code : number = 0;
    time_start : number = 0;

    speed = 0.0;

    x = 0.0;
    y = 0.0;
    z = 0.0;

    r_x = 0.0;
    r_y = 0.0;
    r_z = 0.0;
}

export class Bullet_GPDefender extends Schema{
    @type("string")
    bullet_id = "";
    @type("string")
    player_id = "";
    @type("number")
    bullet_code = 0;
    @type("number")
    time_start = 0;

    @type("number")
    speed = 0.0;

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
}