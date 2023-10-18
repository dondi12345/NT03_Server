"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player_C4PE = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class Player_C4PE extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.state = 0;
        this.curHP = 0;
        this.curMP = 0;
    }
}
__decorate([
    type("number")
], Player_C4PE.prototype, "state", void 0);
__decorate([
    type("number")
], Player_C4PE.prototype, "curHP", void 0);
__decorate([
    type("number")
], Player_C4PE.prototype, "curMP", void 0);
exports.Player_C4PE = Player_C4PE;
