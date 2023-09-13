"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monster_GPDefender = exports.MonsterData_GPDefender = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class MonsterData_GPDefender {
    constructor() {
        this.monster_id = "";
        this.monster_code = 0;
        this.time_born = 0;
        this.space = 0;
        this.way_code = 0;
        this.speed = 0;
        this.hp = 0;
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
exports.Monster_GPDefender = Monster_GPDefender;
