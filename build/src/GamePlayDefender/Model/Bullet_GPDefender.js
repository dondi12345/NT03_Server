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
        this.bullet_code = 0;
        this.time_start = 0;
        this.speed = 0.0;
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.r_x = 0.0;
        this.r_y = 0.0;
        this.r_z = 0.0;
    }
}
exports.BulletData_GPDefender = BulletData_GPDefender;
class Bullet_GPDefender extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.bullet_id = "";
        this.player_id = "";
        this.bullet_code = 0;
        this.time_start = 0;
        this.speed = 0.0;
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.r_x = 0.0;
        this.r_y = 0.0;
        this.r_z = 0.0;
    }
}
__decorate([
    type("string")
], Bullet_GPDefender.prototype, "bullet_id", void 0);
__decorate([
    type("string")
], Bullet_GPDefender.prototype, "player_id", void 0);
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
