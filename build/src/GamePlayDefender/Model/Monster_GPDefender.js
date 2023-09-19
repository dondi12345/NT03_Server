"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterDefaultModel_GPDefender = exports.Monster_GPDefender = exports.MonsterData_GPDefender = exports.MonsterAnimation = void 0;
const schema_1 = require("@colyseus/schema");
const Room_GPDefender_1 = require("./Room_GPDefender");
const LogController_1 = require("../../LogServer/Controller/LogController");
const Bullet_GPDefender_1 = require("./Bullet_GPDefender");
const mongoose_1 = require("mongoose");
const Vector3Utils_1 = require("../../Utils/Vector3Utils");
const Controller__GPDefender_1 = require("../Controller/Controller__GPDefender");
const Message_1 = require("../../MessageServer/Model/Message");
const Message_GPDefender_1 = require("./Message_GPDefender");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
exports.MonsterAnimation = {
    Idle: 0,
    Walk: 1,
    Attack: 2,
};
class MonsterData_GPDefender {
    constructor() {
        this.monster_id = "";
        this.monster_code = 0;
        this.time_born = 0;
        this.space = 0;
        this.way_code = 0;
        this.speed = 0;
        this.hp = 0;
        this.action = 0;
    }
}
exports.MonsterData_GPDefender = MonsterData_GPDefender;
class Monster_GPDefender extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.monster_id = "";
        this.monster_code = 0;
        this.time_born = 0;
        this.space = 0;
        this.way_code = 0;
        this.speed = 0;
        this.hp = 0;
        this.action = 0;
    }
}
__decorate([
    type("string")
], Monster_GPDefender.prototype, "monster_id", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "monster_code", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "time_born", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "space", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "way_code", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "speed", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "hp", void 0);
__decorate([
    type("number")
], Monster_GPDefender.prototype, "action", void 0);
exports.Monster_GPDefender = Monster_GPDefender;
class MonsterDefaultModel_GPDefender {
    constructor() {
        this.is_destroy = false;
        this.count_delay_attack = 0;
        this.is_running = true;
    }
    Start(room, monsterData, monster_GPDefender, path) {
        this.monster_id = monster_GPDefender.monster_id + "";
        this.room = room;
        this.monsterData = monsterData;
        this.monster_GPDefender = monster_GPDefender;
        this.path = path;
        this.Update();
    }
    Destroy() {
        console.log(this.monster_id + " dead");
        this.is_destroy = true;
    }
    Update() {
        if (this.room == undefined || this.room == null || this.is_destroy) {
            LogController_1.logController.LogDev(this.monster_id + " dead");
            return;
        }
        let space = this.monsterData.rank + this.monster_GPDefender.space + (this.room.state.time - this.monster_GPDefender.time_born) * this.monster_GPDefender.speed;
        if (space > this.path.Space) {
            if (this.is_running) {
                this.monster_GPDefender.space += (this.room.state.time - this.monster_GPDefender.time_born) * this.monster_GPDefender.speed;
                this.monster_GPDefender.time_born = this.room.state.time;
                this.monster_GPDefender.speed = 0;
                this.is_running = false;
            }
            this.count_delay_attack -= Room_GPDefender_1.TimeDela;
            if (this.count_delay_attack < 0) {
                this.Attack();
                this.count_delay_attack = this.monsterData.delay_attack;
            }
            else {
                this.monster_GPDefender.action = exports.MonsterAnimation.Idle;
            }
        }
        else {
            if (!this.is_running) {
                this.monster_GPDefender.space += (this.room.state.time - this.monster_GPDefender.time_born) * this.monster_GPDefender.speed;
                this.monster_GPDefender.time_born = this.room.state.time;
                this.monster_GPDefender.speed = this.monsterData.speed;
                this.is_running = true;
            }
            LogController_1.logController.LogDev(this.monster_id + " move");
            this.monster_GPDefender.action = exports.MonsterAnimation.Walk;
        }
        setTimeout(() => {
            this.Update();
        }, Room_GPDefender_1.TimeDela * 1000);
    }
    Attack() {
        this.monster_GPDefender.action = exports.MonsterAnimation.Attack;
        LogController_1.logController.LogDev(this.monster_id + " attack");
        setTimeout(() => {
            var pos = this.GetPos();
            var minPos_Barrior = Controller__GPDefender_1.Pos_Barrier[0];
            var minDis = Vector3Utils_1.Vector3.Distance(pos, Vector3Utils_1.Vector3.New(minPos_Barrior.x, minPos_Barrior.y, minPos_Barrior.z));
            for (let index = 0; index < Controller__GPDefender_1.Pos_Barrier.length; index++) {
                const element = Controller__GPDefender_1.Pos_Barrier[index];
                var dis = Vector3Utils_1.Vector3.Distance(pos, Vector3Utils_1.Vector3.New(element.x, element.y, element.z));
                if (dis < minDis) {
                    minDis = dis;
                    minPos_Barrior = element;
                }
            }
            var bulletData = Bullet_GPDefender_1.BulletData_GPDefender.New(new mongoose_1.Types.ObjectId().toString(), this.monster_id, this.room.state.barrier_id, this.monsterData.bullet_code, this.room.state.time, pos.x, pos.y + 3, pos.z, 0, 0, 0, minPos_Barrior.x, minPos_Barrior.y, minPos_Barrior.z);
            var message = new Message_1.Message();
            message.MessageCode = Message_GPDefender_1.Message_GPDefender.player_fire;
            message.Data = JSON.stringify(bulletData);
            Controller__GPDefender_1.controller_GPDefender.PlayerFire(message, this.room);
            setTimeout(() => {
                var message = new Message_1.Message();
                message.MessageCode = Message_GPDefender_1.Message_GPDefender.bullet_impact;
                message.Data = JSON.stringify(bulletData);
                console.log(message);
                Controller__GPDefender_1.controller_GPDefender.BulletImpact(message, this.room);
                this.room.state.hp_barrier -= this.monsterData.damage;
            }, minDis / 15 * 1000);
        }, this.monsterData.wait_bullet * 1000);
    }
    GetPos() {
        var time = this.room.state.time - this.monster_GPDefender.time_born;
        var curSpace = this.monster_GPDefender.space + this.monster_GPDefender.speed * time;
        var pos = this.path.Points[this.path.Points.length - 1];
        for (let i = 0; i < this.path.Points.length - 1; i++) {
            var dis = Vector3Utils_1.Vector3.Distance(this.path.Points[i], this.path.Points[i + 1]);
            if (dis > curSpace) {
                var d = Vector3Utils_1.Vector3.Minus(this.path.Points[i + 1], this.path.Points[i]);
                pos = Vector3Utils_1.Vector3.New(this.path.Points[i].x + d.x / dis * curSpace, this.path.Points[i].y + d.y / dis * curSpace, this.path.Points[i].z + d.z / dis * curSpace);
                break;
            }
            else {
                curSpace -= dis;
            }
        }
        return pos;
    }
}
exports.MonsterDefaultModel_GPDefender = MonsterDefaultModel_GPDefender;
