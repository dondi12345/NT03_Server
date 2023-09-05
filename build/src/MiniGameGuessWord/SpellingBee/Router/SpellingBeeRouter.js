"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellingBeeRouter = void 0;
const SpellingBeeController_1 = require("../Controller/SpellingBeeController");
const MessageSpellingBee_1 = require("../Model/MessageSpellingBee");
class SpellingBeeRouter {
    Router(room, message, sessionId) {
        if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.player_answer) {
            SpellingBeeController_1.spellingBeeController.PlayerAnswer(room, message, sessionId);
        }
    }
}
exports.spellingBeeRouter = new SpellingBeeRouter();
