"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miniGameWord = void 0;
const arena_1 = require("@colyseus/arena");
const ConfigGameWord_1 = require("./ConfigGameWord");
const Env_1 = require("../Enviroment/Env");
const GuessWordBotService_1 = require("./GuessWordBot/Service/GuessWordBotService");
const SpellingBeeBotService_1 = require("./SpellingBeeBot/Service/SpellingBeeBotService");
class MiniGameWord {
    Init() {
        (0, arena_1.listen)(ConfigGameWord_1.configGuessWord, Env_1.portConfig.portMiniGameWord);
        GuessWordBotService_1.guessNumberBotService;
        SpellingBeeBotService_1.spellingBeeBotService;
    }
    constructor() {
        this.Init();
    }
}
exports.miniGameWord = new MiniGameWord();
