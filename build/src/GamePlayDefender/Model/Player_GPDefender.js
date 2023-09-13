"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player_GPDefender = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class Player_GPDefender extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.name_player = "";
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.r_x = 0.0;
        this.r_y = 0.0;
        this.r_z = 0.0;
        this.d_x = 0.0;
        this.d_y = 0.0;
        this.d_z = 0.0;
        this.d_r_x = 0.0;
        this.d_r_y = 0.0;
        this.d_r_z = 0.0;
    }
}
__decorate([
    type("string")
], Player_GPDefender.prototype, "name_player", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "x", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "y", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "z", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "r_x", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "r_y", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "r_z", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_x", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_y", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_z", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_r_x", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_r_y", void 0);
__decorate([
    type("number")
], Player_GPDefender.prototype, "d_r_z", void 0);
exports.Player_GPDefender = Player_GPDefender;
