"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessNumberBotService = void 0;
const GuessWordBot_1 = require("../Model/GuessWordBot");
class GuessWordBotService {
    constructor() {
        var client1 = new GuessWordBot_1.GuessWordBot();
        client1.Start();
        var client2 = new GuessWordBot_1.GuessWordBot();
        client2.Start();
        var client3 = new GuessWordBot_1.GuessWordBot();
        client3.Start();
        var client4 = new GuessWordBot_1.GuessWordBot();
        client4.Start();
        var client5 = new GuessWordBot_1.GuessWordBot();
        client5.Start();
        var client6 = new GuessWordBot_1.GuessWordBot();
        client6.Start();
        var client7 = new GuessWordBot_1.GuessWordBot();
        client7.Start();
        var client8 = new GuessWordBot_1.GuessWordBot();
        client8.Start();
        var client9 = new GuessWordBot_1.GuessWordBot();
        client9.Start();
        var client10 = new GuessWordBot_1.GuessWordBot();
        client10.Start();
    }
}
exports.guessNumberBotService = new GuessWordBotService();
