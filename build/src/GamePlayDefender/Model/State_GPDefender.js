"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State_GPDefender = void 0;
const schema_1 = require("@colyseus/schema");
const Player_GPDefender_1 = require("./Player_GPDefender");
const Bullet_GPDefender_1 = require("./Bullet_GPDefender");
const Monster_GPDefender_1 = require("./Monster_GPDefender");
const type = schema_1.Context.create();
class State_GPDefender extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.bullets = new schema_1.MapSchema();
        this.monsters = new schema_1.MapSchema();
        this.time = 0;
        this.hp_barrier = 0;
        this.max_hp_barrier = 0;
        this.barrier_id = "barrier";
    }
    createPlayer(sessionId, name_player) {
        var player = new Player_GPDefender_1.Player_GPDefender();
        player.name_player = name_player;
        this.players.set(sessionId, player);
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
    createBullet(bulletData) {
        var bullet = new Bullet_GPDefender_1.Bullet_GPDefender();
        bullet.ParseFromData(bulletData);
        this.bullets.set(bullet.bullet_id, bullet);
    }
    removeBullet(bullet_id) {
        this.bullets.delete(bullet_id);
    }
    createMonster(monsterData) {
        var monster = new Monster_GPDefender_1.Monster_GPDefender();
        monster.monster_id = monsterData.monster_id;
        monster.monster_code = monsterData.monster_code;
        monster.time_born = monsterData.time_born;
        monster.way_code = monsterData.way_code;
        monster.speed = monsterData.speed;
        monster.hp = monsterData.hp;
        monster.space = monsterData.space;
        this.monsters.set(monster.monster_id, monster);
        return monster;
    }
    removeMonster(monster_id) {
        this.monsters.delete(monster_id);
    }
}
__decorate([
    type({ map: Player_GPDefender_1.Player_GPDefender })
], State_GPDefender.prototype, "players", void 0);
__decorate([
    type({ map: Bullet_GPDefender_1.Bullet_GPDefender })
], State_GPDefender.prototype, "bullets", void 0);
__decorate([
    type({ map: Monster_GPDefender_1.Monster_GPDefender })
], State_GPDefender.prototype, "monsters", void 0);
__decorate([
    type("number")
], State_GPDefender.prototype, "time", void 0);
__decorate([
    type("number")
], State_GPDefender.prototype, "hp_barrier", void 0);
__decorate([
    type("number")
], State_GPDefender.prototype, "max_hp_barrier", void 0);
__decorate([
    type("string")
], State_GPDefender.prototype, "barrier_id", void 0);
exports.State_GPDefender = State_GPDefender;
