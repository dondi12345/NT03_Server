"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerGuessWord = void 0;
const schema_1 = require("@colyseus/schema");
const type = schema_1.Context.create(); // this is your @type() decorator bound to a context
class PlayerGuessWord extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.playerName = "";
        this.correct = "";
        this.numb = 0;
        this.score = 0;
        this.status = 0;
    }
    resetData() {
        this.correct = "";
        this.numb = 0;
        this.score = 0;
        this.status = 0;
    }
}
__decorate([
    type("string")
], PlayerGuessWord.prototype, "playerName", void 0);
__decorate([
    type("string")
], PlayerGuessWord.prototype, "correct", void 0);
__decorate([
    type("number")
], PlayerGuessWord.prototype, "numb", void 0);
__decorate([
    type("number")
], PlayerGuessWord.prototype, "score", void 0);
__decorate([
    type("number")
], PlayerGuessWord.prototype, "status", void 0);
exports.PlayerGuessWord = PlayerGuessWord;
