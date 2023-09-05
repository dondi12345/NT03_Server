"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessWordService = void 0;
const arena_1 = require("@colyseus/arena");
const ConfigGuessWord_1 = require("../ConfigGuessWord");
const Env_1 = require("../../../Enviroment/Env");
class GuessWordService {
    Init() {
        (0, arena_1.listen)(ConfigGuessWord_1.configGuessWord, Env_1.portConfig.portGuessNumber);
    }
    constructor() {
        this.Init();
    }
}
exports.guessWordService = new GuessWordService();
