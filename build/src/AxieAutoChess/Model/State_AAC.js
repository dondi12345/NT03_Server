"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State_AAC = void 0;
const schema_1 = require("@colyseus/schema");
const Player_AAC_1 = require("./Player_AAC");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class State_AAC extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.status = 0;
        this.players = new schema_1.MapSchema();
        this.timeTurn = 0;
    }
    createPlayer(sessionId) {
        var player_AAC = new Player_AAC_1.Player_AAC();
        this.players.set(sessionId, player_AAC);
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
__decorate([
    type("number")
], State_AAC.prototype, "status", void 0);
__decorate([
    type({ map: Player_AAC_1.Player_AAC })
], State_AAC.prototype, "players", void 0);
__decorate([
    type("number")
], State_AAC.prototype, "timeTurn", void 0);
exports.State_AAC = State_AAC;
