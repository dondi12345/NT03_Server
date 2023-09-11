import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context

export class MonsterData_GPDefender{
    monster_id : string = "";
    monster_code : number = 0;
    
    speed = 0.0;
    hp = 0;

    x = 0.0;
    y = 0.0;
    z = 0.0;
}

export class Monster_GPDefender extends Schema{
    @type("string")
    monster_id = "";
    @type("number")
    monster_code = 0;

    @type("number")
    speed = 0;
    @type("number")
    hp = 0;

    @type("number")
    x = 0;
    @type("number")
    y = 0;
    @type("number")
    z = 0;
}