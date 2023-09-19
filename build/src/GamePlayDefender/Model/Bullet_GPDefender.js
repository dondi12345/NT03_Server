"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet_GPDefender = exports.BulletData_GPDefender = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class BulletData_GPDefender {
    constructor() {
        this.bullet_id = "";
        this.player_id = "";
        this.target_id = "";
        this.bullet_code = 0;
        this.time_start = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r_x = 0;
        this.r_y = 0;
        this.r_z = 0;
    }
    static New(bullet_id, player_id, target_id, bullet_code, time_start, x, y, z, r_x, r_y, r_z, end_x, end_y, end_z) {
        var bulletData_GPDefender = new BulletData_GPDefender();
        bulletData_GPDefender.bullet_id = bullet_id;
        bulletData_GPDefender.player_id = player_id;
        bulletData_GPDefender.target_id = target_id;
        bulletData_GPDefender.bullet_code = bullet_code;
        bulletData_GPDefender.time_start = time_start;
        bulletData_GPDefender.x = x;
        bulletData_GPDefender.y = y;
        bulletData_GPDefender.z = z;
        bulletData_GPDefender.r_x = r_x;
        bulletData_GPDefender.r_y = r_y;
        bulletData_GPDefender.r_z = r_z;
        return bulletData_GPDefender;
    }
}
exports.BulletData_GPDefender = BulletData_GPDefender;
class Bullet_GPDefender extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.bullet_id = "";
        this.player_id = "";
        this.target_id = "";
        this.bullet_code = 0;
        this.time_start = 0;
        this.speed = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.r_x = 0;
        this.r_y = 0;
        this.r_z = 0;
    }
    ParseFromData(bulletData_GPDefender) {
        this.bullet_id = bulletData_GPDefender.bullet_id;
        this.player_id = bulletData_GPDefender.player_id;
        this.target_id = bulletData_GPDefender.target_id;
        this.bullet_code = bulletData_GPDefender.bullet_code;
        this.time_start = bulletData_GPDefender.time_start;
        this.x = bulletData_GPDefender.x;
        this.y = bulletData_GPDefender.y;
        this.z = bulletData_GPDefender.z;
        this.r_x = bulletData_GPDefender.r_x;
        this.r_y = bulletData_GPDefender.r_y;
        this.r_z = bulletData_GPDefender.r_z;
    }
}
__decorate([
    type("string")
], Bullet_GPDefender.prototype, "bullet_id", void 0);
__decorate([
    type("string")
], Bullet_GPDefender.prototype, "player_id", void 0);
__decorate([
    type("string")
], Bullet_GPDefender.prototype, "target_id", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "bullet_code", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "time_start", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "speed", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "x", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "y", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "z", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "r_x", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "r_y", void 0);
__decorate([
    type("number")
], Bullet_GPDefender.prototype, "r_z", void 0);
exports.Bullet_GPDefender = Bullet_GPDefender;
