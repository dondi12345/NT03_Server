"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessWordRouter = void 0;
const GuessWordController_1 = require("../Controller/GuessWordController");
const MessageGuessWord_1 = require("../Model/MessageGuessWord");
class GuessWordRouter {
    Router(room, message, sessionId) {
        if (message.MessageCode == MessageGuessWord_1.MessageGuessWord.player_answer) {
            GuessWordController_1.guessWordController.PlayerAnswer(room, message, sessionId);
        }
    }
}
exports.guessWordRouter = new GuessWordRouter();
