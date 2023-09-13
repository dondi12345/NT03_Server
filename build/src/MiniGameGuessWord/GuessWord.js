"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miniGameWord = void 0;
const arena_1 = require("@colyseus/arena");
const ConfigGameWord_1 = require("./ConfigGameWord");
const Env_1 = require("../Enviroment/Env");
class MiniGameWord {
    Init() {
        (0, arena_1.listen)(ConfigGameWord_1.configGuessWord, Env_1.portConfig.portMiniGameWord);
        // guessNumberBotService;
        // spellingBeeBotService;
    }
    constructor() {
        this.Init();
    }
}
exports.miniGameWord = new MiniGameWord();
