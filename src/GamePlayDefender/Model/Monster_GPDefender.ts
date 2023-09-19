import { Schema, Context } from "@colyseus/schema";
import { Room_GPDefender, TimeDela } from "./Room_GPDefender";
import { MonsterData, Path } from "../Controller/MonsterBot_GPDefender";
import { logController } from "../../LogServer/Controller/LogController";
import { BulletData_GPDefender } from "./Bullet_GPDefender";
import { Types } from "mongoose";
import { Vector3 } from "../../Utils/Vector3Utils";
import { Pos_Barrier, Pos_Player, controller_GPDefender } from "../Controller/Controller__GPDefender";
import { Message } from "../../MessageServer/Model/Message";
import { Message_GPDefender } from "./Message_GPDefender";
const type = Context.create(); // this is your @type() decorator bound to a context

export const MonsterAnimation = {
    Idle : 0,
    Walk : 1,
    Attack : 2,
}

export class MonsterData_GPDefender{
    monster_id : string = "";
    monster_code : number = 0;
    time_born : number = 0;
    space : number = 0;

    way_code = 0;
    speed = 0;
    hp = 0;
    action = 0;
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
    @type("number")
    action = 0;
}

export class MonsterDefaultModel_GPDefender{
    monster_GPDefender : Monster_GPDefender
    monsterData : MonsterData
    path : Path
    room : Room_GPDefender

    monster_id : string;

    is_destroy = false;
    count_delay_attack : number = 0;

    is_running = true;

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
            logController.LogDev(this.monster_id + " dead")
            return;
        }
        let space = this.monsterData.rank + this.monster_GPDefender.space + (this.room.state.time - this.monster_GPDefender.time_born)*this.monster_GPDefender.speed;
        if(space > this.path.Space){
            if(this.is_running){
                this.monster_GPDefender.space += (this.room.state.time - this.monster_GPDefender.time_born)*this.monster_GPDefender.speed;
                this.monster_GPDefender.time_born = this.room.state.time;
                this.monster_GPDefender.speed = 0;
                this.is_running = false;
            }
            this.count_delay_attack -= TimeDela;
            if(this.count_delay_attack < 0){
                this.Attack();
                this.count_delay_attack = this.monsterData.delay_attack;
            }else{
                this.monster_GPDefender.action = MonsterAnimation.Idle;
            }
        }else{
            if(!this.is_running){
                this.monster_GPDefender.space += (this.room.state.time - this.monster_GPDefender.time_born)*this.monster_GPDefender.speed;
                this.monster_GPDefender.time_born = this.room.state.time;
                this.monster_GPDefender.speed = this.monsterData.speed;
                this.is_running = true;
            }
            logController.LogDev(this.monster_id + " move")
            this.monster_GPDefender.action = MonsterAnimation.Walk;
        }
        setTimeout(() => {
            this.Update();
        }, TimeDela*1000)
    }

    Attack(){
        this.monster_GPDefender.action = MonsterAnimation.Attack;
        logController.LogDev(this.monster_id + " attack")
        setTimeout(() => {
            var pos = this.GetPos();
            var minPos_Barrior = Pos_Barrier[0];
            var minDis = Vector3.Distance(pos, Vector3.New(minPos_Barrior.x, minPos_Barrior.y, minPos_Barrior.z));
            for (let index = 0; index < Pos_Barrier.length; index++) {
                const element = Pos_Barrier[index];
                var dis = Vector3.Distance(pos, Vector3.New(element.x, element.y, element.z));
                if(dis < minDis){
                    minDis = dis;
                    minPos_Barrior = element;
                }
            }
            var bulletData = BulletData_GPDefender.New(new Types.ObjectId().toString(), this.monster_id, this.room.state.barrier_id, this.monsterData.bullet_code,
                this.room.state.time, pos.x, pos.y + 3, pos.z, 0,0,0,minPos_Barrior.x,minPos_Barrior.y,minPos_Barrior.z);
                var message = new Message();
            message.MessageCode = Message_GPDefender.player_fire;
            message.Data = JSON.stringify(bulletData);
            controller_GPDefender.PlayerFire(message, this.room);

            
            setTimeout(()=>{
                var message = new Message();
                message.MessageCode = Message_GPDefender.bullet_impact;
                message.Data = JSON.stringify(bulletData);
                controller_GPDefender.BulletImpact(message, this.room);
                controller_GPDefender.BarrierTakeDmg(this.monsterData.damage, this.room);
            }, minDis/15 * 1000);
        }, this.monsterData.wait_bullet*1000)
    }

    GetPos(){
        var time : number = this.room.state.time - this.monster_GPDefender.time_born;
        var curSpace = this.monster_GPDefender.space + this.monster_GPDefender.speed*time;
        var pos : Vector3 = this.path.Points[this.path.Points.length-1];
        for (let i = 0; i < this.path.Points.length-1; i++)
        {
            var dis : number = Vector3.Distance(this.path.Points[i], this.path.Points[i+1]);
            if(dis > curSpace){
                var d = Vector3.Minus(this.path.Points[i+1], this.path.Points[i]);
                pos = Vector3.New(this.path.Points[i].x + d.x/dis *curSpace,
                                            this.path.Points[i].y + d.y/dis *curSpace,
                                            this.path.Points[i].z + d.z/dis *curSpace);
                break;
            }else{
                curSpace -= dis;
            }

        }
        return pos;
    }
}