"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellingBeeController = void 0;
const DataModel_1 = require("../../../Utils/DataModel");
const Message_1 = require("../../../MessageServer/Model/Message");
const AnswerSpellingBee_1 = require("../Model/AnswerSpellingBee");
const MessageSpellingBee_1 = require("../Model/MessageSpellingBee");
const Score = {
    correct: 5,
};
class SpellingBeeController {
    PlayerAnswer(room, message, sessionId) {
        var clientData = room.clientDatas[sessionId];
        if (clientData == null || clientData == undefined)
            return;
        var player = room.state.players.get(sessionId);
        if (player == null || player == undefined) {
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.answer_inval;
            message.Data = "Not found player";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        var answerPlayer = DataModel_1.DataModel.Parse(message.Data);
        if (answerPlayer.answer.length < 3) {
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.answer_inval;
            message.Data = "Word too short";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        if (!CheckWord(answerPlayer.answer, room.roomConfig.words, clientData.hisAnswer)) {
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.answer_inval;
            message.Data = "Inval word";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        clientData.hisAnswer.push(answerPlayer.answer);
        player.score += answerPlayer.answer.length * Score.correct;
        var resultAnswerSpellingBee = new AnswerSpellingBee_1.ResultAnswerSpellingBee();
        resultAnswerSpellingBee.answers = clientData.hisAnswer;
        var message = new Message_1.Message();
        message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.result_answer;
        message.Data = JSON.stringify(resultAnswerSpellingBee);
        var messageData = new Message_1.MessageData([JSON.stringify(message)]);
        room.sendToClient(JSON.stringify(messageData), clientData.client);
    }
}
function CheckWord(word, words, answers) {
    var str;
    str = words.find((data) => (data == word));
    var ans = answers.find((data) => (data == word));
    if (str == null || str == undefined || str.length == 0) {
        return false;
    }
    else {
        if (ans == null || ans == undefined || ans.length == 0) {
            return true;
        }
        return false;
    }
}
exports.spellingBeeController = new SpellingBeeController();
