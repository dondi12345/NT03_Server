"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player_AAC = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class Player_AAC extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.status = 0;
        this.gold = 0;
        this.exp = 0;
        this.lv = 0;
        this.slot1 = 0;
        this.start1 = 0;
        this.slot2 = 0;
        this.start2 = 0;
        this.slot3 = 0;
        this.start3 = 0;
        this.slot4 = 0;
        this.start4 = 0;
        this.slot5 = 0;
        this.start5 = 0;
        this.slot6 = 0;
        this.start6 = 0;
        this.slot7 = 0;
        this.start7 = 0;
        this.slot8 = 0;
        this.start8 = 0;
        this.slot9 = 0;
        this.start9 = 0;
    }
}
__decorate([
    type("number")
], Player_AAC.prototype, "status", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "gold", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "exp", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "lv", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot1", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start1", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot2", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start2", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot3", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start3", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot4", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start4", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot5", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start5", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot6", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start6", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot7", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start7", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot8", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start8", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "slot9", void 0);
__decorate([
    type("number")
], Player_AAC.prototype, "start9", void 0);
exports.Player_AAC = Player_AAC;
