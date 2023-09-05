"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateGuessWord = exports.StatusPlayer = void 0;
const schema_1 = require("@colyseus/schema");
const PlayerGuessWord_1 = require("./PlayerGuessWord");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
const Ans = {
    correct: "2",
    correctNumber: "1",
    wrong: "0"
};
exports.StatusPlayer = {
    Lose: -1,
    Do: 0,
    Win: 1,
};
class StateGuessWord extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.something = "This attribute won't be sent to the client-side";
    }
    createPlayer(sessionId, playerName) {
        var playerGuessWord = new PlayerGuessWord_1.PlayerGuessWord();
        playerGuessWord.playerName = playerName;
        this.players.set(sessionId, playerGuessWord);
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
}
__decorate([
    type({ map: PlayerGuessWord_1.PlayerGuessWord })
], StateGuessWord.prototype, "players", void 0);
exports.StateGuessWord = StateGuessWord;
