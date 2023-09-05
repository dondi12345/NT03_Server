"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSpellingBee = void 0;
const schema_1 = require("@colyseus/schema");
const PlayerSpellingBee_1 = require("./PlayerSpellingBee");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class StateSpellingBee extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.something = "This attribute won't be sent to the client-side";
    }
    createPlayer(sessionId, playerName) {
        var playerGuessWord = new PlayerSpellingBee_1.PlayerSpellingBee();
        playerGuessWord.playerName = playerName;
        this.players.set(sessionId, playerGuessWord);
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
__decorate([
    type({ map: PlayerSpellingBee_1.PlayerSpellingBee })
], StateSpellingBee.prototype, "players", void 0);
exports.StateSpellingBee = StateSpellingBee;