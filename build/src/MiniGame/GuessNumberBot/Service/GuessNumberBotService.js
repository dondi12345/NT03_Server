"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessNumberBotService = void 0;
const GuessNumberBot_1 = require("../Model/GuessNumberBot");
class GuessNumberBotService {
    constructor() {
        var client1 = new GuessNumberBot_1.GuessNumberBot();
        client1.Start();
        var client2 = new GuessNumberBot_1.GuessNumberBot();
        client2.Start();
        var client3 = new GuessNumberBot_1.GuessNumberBot();
        client3.Start();
        var client4 = new GuessNumberBot_1.GuessNumberBot();
        client4.Start();
        var client5 = new GuessNumberBot_1.GuessNumberBot();
        client5.Start();
        var client6 = new GuessNumberBot_1.GuessNumberBot();
        client6.Start();
        var client7 = new GuessNumberBot_1.GuessNumberBot();
        client7.Start();
        var client8 = new GuessNumberBot_1.GuessNumberBot();
        client8.Start();
        var client9 = new GuessNumberBot_1.GuessNumberBot();
        client9.Start();
        var client10 = new GuessNumberBot_1.GuessNumberBot();
        client10.Start();
    }
}
exports.guessNumberBotService = new GuessNumberBotService();
