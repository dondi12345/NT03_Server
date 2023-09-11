import { Types } from "mongoose";
import { MonsterData_GPDefender } from "../Model/Monster_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";
import { Pos, controller_GPDefender } from "./Controller__GPDefender";
import { Vector3 } from "../../Utils/Vector3Utils";

const PosSpawnMonster = [
    {
        x: 10, y: 0, z: 20
    },
    {
        x: 5, y: 0, z: 20,
    },
    {
        x: 0, y: 0, z: 20,
    },
    {
        x: -5, y: 0, z: 20,
    },
    {
        x: 10, y: 0, z: 20,
    }
]

const MonsterData = [
    {
        "monster_code": 0,
        "speed": 1.2,
        "hp": 100
    },
    {
        "monster_code": 1,
        "speed": 1,
        "hp": 150
    }
]

const MonsterSpawnData = {
    delay_spawn : 1,
    max_monster : 10,
}

const TimeDela = 0.5;

export class MonsterBot_GPDefender {

    Room: Room_GPDefender;
    StartDefense: boolean = false;

    CountDelaySpawn : number = 0;

    CountMonster : number = 0;

    Start(room: Room_GPDefender) {
        this.Room = room;
        this.Update();
    }

    Update() {
        this.CountDelaySpawn -= TimeDela;

        if(this.CountMonster < MonsterSpawnData.max_monster){
            if(this.CountDelaySpawn < 0){
                this.SpawnMonster();
                this.CountMonster++;
                this.CountDelaySpawn = MonsterSpawnData.delay_spawn;
            }
        }
        this.MoveMonster();
        setTimeout(() => {
            this.Update();
        }, TimeDela*1000)
    }

    SpawnMonster(){
        var data = MonsterData[this.CountMonster%MonsterData.length]
        var pos = PosSpawnMonster[this.CountMonster%PosSpawnMonster.length]
        var monsterData = new MonsterData_GPDefender();
        monsterData.monster_id = new Types.ObjectId().toString();
        monsterData.monster_code = data.monster_code;
        monsterData.hp = data.hp;
        monsterData.speed = data.speed;
        monsterData.x = pos.x;
        monsterData.y = pos.y;
        monsterData.z = pos.z;
        controller_GPDefender.MonsterSpawn(monsterData, this.Room);
        console.log("Spawn Monster")
    }

    MoveMonster(){
        this.Room.state.monsters.forEach(element=>{
            var pos = Pos[0]
            var vec = Vector3.Minus(Vector3.New(element.x, element.y, element.z), Vector3.New(pos.x, pos.y, pos.z));
            var step = (element.speed / Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z)) * TimeDela;
            if(step == null || step == undefined || Number.isNaN(step)) return;
            element.x -= vec.x*step;
            element.y -= vec.y*step;
            element.z -= vec.z*step;
            console.log(element.x, element.y, element.z);
        })
    }
}