import { Types } from "mongoose";
import { MonsterData_GPDefender, MonsterDefaultModel_GPDefender, Monster_GPDefender } from "../Model/Monster_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";
import { Pos, controller_GPDefender } from "./Controller__GPDefender";

export class Position {
    x : number = 0;
    y : number = 0;
    z : number = 0;
}

export class Path {
    Points : Position[] = [];
    Space : number = 0;
}

const Paths : Path[]= [
    {
        Points :
            [
                {
                    x : -68, y : 0, z : -60
                },
                {
                    x : -68, y : 0, z : 19.12
                }
            ],
        Space : 79.12
    },
    {
        Points :
            [
                {
                    x : -76.3, y : 0, z : -60
                },
                {
                    x : -76.3, y : 0, z : 19.12
                }
            ],
        Space : 79.12
    },
    {
        Points :
            [
                {
                    x : -72.5, y : 0, z : -60
                },
                {
                    x : -72.5, y : 0, z : -5
                }
            ],
        Space : 65
    },
    {
        Points :
            [
                {
                    x : -64.5, y : 0, z : -60
                },
                {
                    x : -64.5, y : 0, z : -5
                }
            ],
        Space : 65
    },
]

export class MonsterData {
    monster_code : number;
    speed : number;
    hp : number;
    delay_attack : number;
    wait_bullet : number;
    damage : number;
}

const MonsterDatas : MonsterData[] = [
    {
        "monster_code": 0,
        "speed": 2.4,
        "hp": 100,
        "delay_attack" : 4,
        "wait_bullet" : 2,
        "damage" : 7,
    },
    {
        "monster_code": 1,
        "speed": 2,
        "hp": 150,
        "delay_attack" : 7,
        "wait_bullet" : 1.33,
        "damage" : 10,
    }
]

class SpawnData{
    time : number
    monsters : MonsterSpawnData[]
}

class MonsterSpawnData {
    monster_code : number
    way_code : number
}

const SpawnDatas : SpawnData[] = [
    {
        time : 1,
        monsters:[
            {
                monster_code : 0,
                way_code : 2,
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
                way_code : 3,
            },
        ]
    },
    {
        time : 4,
        monsters:[
            {
                monster_code : 0,
                way_code : 2,
            },
            {
                monster_code : 1,
                way_code : 1,
            },
        ]
    },
]

type MonsterDefaultModel_GPDefenderDictionary = Record<string, MonsterDefaultModel_GPDefender>;

export class MonsterBot_GPDefender {
    Room: Room_GPDefender;
    StartDefense: boolean = false;

    CountDelaySpawn : number = 0;

    CountMonster : number = 0;

    Monsters : MonsterDefaultModel_GPDefenderDictionary

    Init(room: Room_GPDefender) {
        this.Room = room;
        this.Monsters = {};
    }

    Destroy(){
        for (let key in this.Monsters) {
            let value = this.Monsters[key];
            value.Destroy();
            delete this.Monsters[key];
        }
    }

    Update() {
        if(this.CountDelaySpawn >= SpawnDatas.length) return;
        if(this.Room.state.time > SpawnDatas[this.CountDelaySpawn].time){
            this.SpawnMonster(SpawnDatas[this.CountDelaySpawn]);
        }

    }
    SpawnMonster(data : SpawnData){
        this.CountDelaySpawn++;
        data.monsters.forEach(element => {
            var data_monster = MonsterDatas[element.monster_code];
            console.log(data_monster);
            var monsterData_GPDefender = new MonsterData_GPDefender();
            monsterData_GPDefender.monster_id = new Types.ObjectId().toString();
            monsterData_GPDefender.monster_code = element.monster_code;
            monsterData_GPDefender.time_born = this.Room.state.time;
            monsterData_GPDefender.way_code = element.way_code;
            monsterData_GPDefender.hp = data_monster.hp;
            monsterData_GPDefender.space = 0;
            monsterData_GPDefender.speed = data_monster.speed;
            var monster = controller_GPDefender.MonsterSpawn(monsterData_GPDefender, this.Room);
            var monsterDefaultModel_GPDefender = new MonsterDefaultModel_GPDefender();
            if(monster != null && monster != undefined){
                monsterDefaultModel_GPDefender.Start(this.Room, data_monster, monster,Paths[element.way_code]);
                this.Monsters[monster.monster_id] = monsterDefaultModel_GPDefender;
            };
            console.log("Spawn Monster")
        });
    }
    DestroyMonster(monster_id: string){
        var monster = this.Monsters[monster_id];
        if(monster == null || monster == undefined) return;
        monster.is_destroy = true;
        delete this.Monsters[monster_id];
    }
}