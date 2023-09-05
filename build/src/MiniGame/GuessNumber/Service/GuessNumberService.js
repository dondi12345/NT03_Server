"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessNumberService = void 0;
const tools_1 = require("@colyseus/tools");
const Env_1 = require("../../../Enviroment/Env");
const ConfigGuessNumber_1 = require("../ConfigGuessNumber");
class GuessNumberService {
    Init() {
        (0, tools_1.listen)(ConfigGuessNumber_1.configGuessNumber, Env_1.portConfig.portGuessNumber);
    }
    constructor() {
        this.Init();
    }
}
exports.guessNumberService = new GuessNumberService();
