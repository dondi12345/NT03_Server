"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterBot_GPDefender = exports.MonsterData = exports.Path = exports.Position = void 0;
const mongoose_1 = require("mongoose");
const Monster_GPDefender_1 = require("../Model/Monster_GPDefender");
const Controller__GPDefender_1 = require("./Controller__GPDefender");
class Position {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
exports.Position = Position;
class Path {
    constructor() {
        this.Points = [];
        this.Space = 0;
    }
}
exports.Path = Path;
const Paths = [
    {
        Points: [
            {
                x: -68, y: 0, z: -60
            },
            {
                x: -68, y: 0, z: 19.12
            }
        ],
        Space: 79.12
    },
    {
        Points: [
            {
                x: -76.3, y: 0, z: -60
            },
            {
                x: -76.3, y: 0, z: 19.12
            }
        ],
        Space: 79.12
    },
    {
        Points: [
            {
                x: -72.5, y: 0, z: -60
            },
            {
                x: -72.5, y: 0, z: -5
            }
        ],
        Space: 65
    },
    {
        Points: [
            {
                x: -64.5, y: 0, z: -60
            },
            {
                x: -64.5, y: 0, z: -5
            }
        ],
        Space: 65
    },
];
class MonsterData {
}
exports.MonsterData = MonsterData;
const MonsterDatas = [
    {
        "monster_code": 0,
        "speed": 2.4,
        "hp": 100,
        "delay_attack": 4,
        "wait_bullet": 2,
        "damage": 7,
    },
    {
        "monster_code": 1,
        "speed": 2,
        "hp": 150,
        "delay_attack": 7,
        "wait_bullet": 1.33,
        "damage": 10,
    }
];
class SpawnData {
}
class MonsterSpawnData {
}
const SpawnDatas = [
    {
        time: 1,
        monsters: [
            {
                monster_code: 0,
                way_code: 2,
            },
        ]
    },
    {
        time: 2,
        monsters: [
            {
                monster_code: 1,
                way_code: 1,
            },
        ]
    },
    {
        time: 3,
        monsters: [
            {
                monster_code: 1,
                way_code: 0,
            },
            {
                monster_code: 0,
                way_code: 3,
            },
        ]
    },
    {
        time: 4,
        monsters: [
            {
                monster_code: 0,
                way_code: 2,
            },
            {
                monster_code: 1,
                way_code: 1,
            },
        ]
    },
];
class MonsterBot_GPDefender {
    constructor() {
        this.StartDefense = false;
        this.CountDelaySpawn = 0;
        this.CountMonster = 0;
    }
    Init(room) {
        this.Room = room;
        this.Monsters = {};
    }
    Destroy() {
        for (let key in this.Monsters) {
            let value = this.Monsters[key];
            value.Destroy();
            delete this.Monsters[key];
        }
    }
    Update() {
        if (this.CountDelaySpawn >= SpawnDatas.length)
            return;
        if (this.Room.state.time > SpawnDatas[this.CountDelaySpawn].time) {
            this.SpawnMonster(SpawnDatas[this.CountDelaySpawn]);
        }
    }
    SpawnMonster(data) {
        this.CountDelaySpawn++;
        data.monsters.forEach(element => {
            var data_monster = MonsterDatas[element.monster_code];
            console.log(data_monster);
            var monsterData_GPDefender = new Monster_GPDefender_1.MonsterData_GPDefender();
            monsterData_GPDefender.monster_id = new mongoose_1.Types.ObjectId().toString();
            monsterData_GPDefender.monster_code = element.monster_code;
            monsterData_GPDefender.time_born = this.Room.state.time;
            monsterData_GPDefender.way_code = element.way_code;
            monsterData_GPDefender.hp = data_monster.hp;
            monsterData_GPDefender.space = 0;
            monsterData_GPDefender.speed = data_monster.speed;
            var monster = Controller__GPDefender_1.controller_GPDefender.MonsterSpawn(monsterData_GPDefender, this.Room);
            var monsterDefaultModel_GPDefender = new Monster_GPDefender_1.MonsterDefaultModel_GPDefender();
            if (monster != null && monster != undefined) {
                monsterDefaultModel_GPDefender.Start(this.Room, data_monster, monster, Paths[element.way_code]);
                this.Monsters[monster.monster_id] = monsterDefaultModel_GPDefender;
            }
            ;
            console.log("Spawn Monster");
        });
    }
    DestroyMonster(monster_id) {
        var monster = this.Monsters[monster_id];
        if (monster == null || monster == undefined)
            return;
        monster.is_destroy = true;
        delete this.Monsters[monster_id];
    }
}
exports.MonsterBot_GPDefender = MonsterBot_GPDefender;
