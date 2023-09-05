"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessNumberRouter = void 0;
const GuessNumberController_1 = require("../Controller/GuessNumberController");
const MessageGuessNumber_1 = require("../Model/MessageGuessNumber");
class GuessNumberRouter {
    Router(room, message, sessionId) {
        if (message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.player_answer) {
            GuessNumberController_1.guessNumberController.PlayerAnswer(room, message, sessionId);
        }
    }
}
exports.guessNumberRouter = new GuessNumberRouter();
