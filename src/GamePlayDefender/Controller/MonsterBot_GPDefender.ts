import { Types } from "mongoose";
import { MonsterData_GPDefender } from "../Model/Monster_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";
import { Pos, controller_GPDefender } from "./Controller__GPDefender";

const Wave_Start = [
    {
        x: -66, y: 0, z: -60
    },
    {
        x: -76.3, y: 0, z: -60,
    },
]

const MonsterData = [
    {
        "monster_code": 0,
        "speed": 2.4,
        "hp": 100
    },
    {
        "monster_code": 1,
        "speed": 2,
        "hp": 150
    }
]

const MonsterSpawnData = [
    {
        time : 1,
        monsters:[
            {
                monster_code : 0,
                way_code : 0,
            },
        ]
    },
    {
        time : 2,
        monsters:[
            {
                monster_code : 1,
                way_code : 1,
            },
        ]
    },
    {
        time : 3,
        monsters:[
            {
                monster_code : 1,
                way_code : 0,
            },
            {
                monster_code : 0,
                way_code : 1,
            },
        ]
    },
    {
        time : 4,
        monsters:[
            {
                monster_code : 0,
                way_code : 0,
            },
            {
                monster_code : 1,
                way_code : 1,
            },
        ]
    },
]

export class MonsterBot_GPDefender {
    Room: Room_GPDefender;
    StartDefense: boolean = false;

    CountDelaySpawn : number = 0;

    CountMonster : number = 0;

    Init(room: Room_GPDefender) {
        this.Room = room;
    }

    Update() {
        if(this.CountDelaySpawn >= MonsterSpawnData.length) return;
        if(this.Room.state.time > MonsterSpawnData[this.CountDelaySpawn].time){
            this.SpawnMonster(MonsterSpawnData[this.CountDelaySpawn]);
        }
    }
    SpawnMonster(data){
        this.CountDelaySpawn++;
        data.monsters.forEach(element => {
            var data_monster = MonsterData[element.monster_code];
            var pos = Wave_Start[element.way_code]
            var monsterData = new MonsterData_GPDefender();
            monsterData.monster_id = new Types.ObjectId().toString();
            monsterData.monster_code = element.monster_code;
            monsterData.time_born = this.Room.state.time;
            monsterData.way_code = element.way_code;
            monsterData.hp = data_monster.hp;
            monsterData.space = 0;
            monsterData.speed = data_monster.speed;
            controller_GPDefender.MonsterSpawn(monsterData, this.Room);
            console.log("Spawn Monster")
        });
    }
}