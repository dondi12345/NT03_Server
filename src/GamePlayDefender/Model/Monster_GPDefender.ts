import { Schema, Context } from "@colyseus/schema";
import { Room_GPDefender, TimeDela } from "./Room_GPDefender";
import { MonsterData, Path } from "../Controller/MonsterBot_GPDefender";
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

export class MonsterDefaultModel_GPDefender{
    monster_GPDefender : Monster_GPDefender
    monsterData : MonsterData
    path : Path
    room : Room_GPDefender

    monster_id : string;

    is_destroy = false;
    count_delay_attack : number = 0;

    Start(room : Room_GPDefender, monsterData : MonsterData, monster_GPDefender : Monster_GPDefender, path : Path){
        this.monster_id = monster_GPDefender.monster_id+"";
        this.room = room;
        this.monsterData = monsterData;
        this.monster_GPDefender = monster_GPDefender;
        this.path = path;
        this.Update();
    }

    Destroy(){
        console.log(this.monster_id + " dead")
        this.is_destroy = true;
    }

    Update() {
        if(this.room == undefined || this.room == null || this.is_destroy){
            console.log(this.monster_id + " dead")
            return;
        }
        let space = this.monster_GPDefender.space + (this.room.state.time - this.monster_GPDefender.time_born)*this.monster_GPDefender.speed;
        if(space > this.path.Space){
            this.count_delay_attack -= TimeDela;
            if(this.count_delay_attack < 0){
                this.Attack();
                this.count_delay_attack = this.monsterData.delay_attack;
            }
        }else{
            console.log(this.monster_id + " move")
        }
        setTimeout(() => {
            this.Update();
        }, TimeDela*1000)
    }

    Attack(){
        console.log(this.monster_id + " attack")
        this.room.state.hp_barrier -= this.monsterData.damage;
    }
}