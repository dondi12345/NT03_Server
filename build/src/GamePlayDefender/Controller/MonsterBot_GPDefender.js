"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterBot_GPDefender = void 0;
const mongoose_1 = require("mongoose");
const Monster_GPDefender_1 = require("../Model/Monster_GPDefender");
const Controller__GPDefender_1 = require("./Controller__GPDefender");
const Wave_Start = [
    {
        x: -66, y: 0, z: -60
    },
    {
        x: -76.3, y: 0, z: -60,
    },
];
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
];
const MonsterSpawnData = [
    {
        time: 1,
        monsters: [
            {
                monster_code: 0,
                way_code: 0,
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
                way_code: 1,
            },
        ]
    },
    {
        time: 4,
        monsters: [
            {
                monster_code: 0,
                way_code: 0,
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
    }
    Update() {
        if (this.CountDelaySpawn >= MonsterSpawnData.length)
            return;
        if (this.Room.state.time > MonsterSpawnData[this.CountDelaySpawn].time) {
            this.SpawnMonster(MonsterSpawnData[this.CountDelaySpawn]);
        }
    }
    SpawnMonster(data) {
        this.CountDelaySpawn++;
        data.monsters.forEach(element => {
            var data_monster = MonsterData[element.monster_code];
            var pos = Wave_Start[element.way_code];
            var monsterData = new Monster_GPDefender_1.MonsterData_GPDefender();
            monsterData.monster_id = new mongoose_1.Types.ObjectId().toString();
            monsterData.monster_code = element.monster_code;
            monsterData.time_born = this.Room.state.time;
            monsterData.way_code = element.way_code;
            monsterData.hp = data_monster.hp;
            monsterData.space = 0;
            monsterData.speed = data_monster.speed;
            Controller__GPDefender_1.controller_GPDefender.MonsterSpawn(monsterData, this.Room);
            console.log("Spawn Monster");
        });
    }
}
exports.MonsterBot_GPDefender = MonsterBot_GPDefender;
