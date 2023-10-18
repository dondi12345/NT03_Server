"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State_C4PE = void 0;
const schema_1 = require("@colyseus/schema");
const Player_C4PE_1 = require("./Player_C4PE");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class State_C4PE extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.timeTurn = 0;
    }
    createPlayer(sessionId) {
        var player_C4PE = new Player_C4PE_1.Player_C4PE();
        this.players.set(sessionId, player_C4PE);
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
__decorate([
    type({ map: Player_C4PE_1.Player_C4PE })
], State_C4PE.prototype, "players", void 0);
__decorate([
    type("number")
], State_C4PE.prototype, "timeTurn", void 0);
exports.State_C4PE = State_C4PE;
