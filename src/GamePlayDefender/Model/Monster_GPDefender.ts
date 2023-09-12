import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context

export class MonsterData_GPDefender{
    monster_id : string = "";
    monster_code : number = 0;
    time_born : number = 0;
    space : number = 0;

    way_code = 0;
    speed = 0;
    hp = 0;
}

export class Monster_GPDefender extends Schema{
    @type("string")
    monster_id = "";
    @type("number")
    monster_code = 0;
    @type("number")
    time_born = 0;
    @type("number")
    space = 0;


    @type("number")
    way_code = 0;
    @type("number")
    speed = 0;
    @type("number")
    hp = 0;
}