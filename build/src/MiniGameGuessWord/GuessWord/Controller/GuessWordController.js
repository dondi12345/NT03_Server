"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessWordController = exports.AnsCheck = void 0;
const DataModel_1 = require("../../../Utils/DataModel");
const StringUtils_1 = require("../../../Utils/StringUtils");
const AnswerPlayer_1 = require("../Model/AnswerPlayer");
const MessageGuessWord_1 = require("../Model/MessageGuessWord");
const StateGuessWord_1 = require("../Model/StateGuessWord");
const WordService_1 = require("../Service/WordService");
const Message_1 = require("../../../MessageServer/Model/Message");
exports.AnsCheck = {
    correct: "2",
    correctNumber: "1",
    wrong: "0"
};
const Score = {
    correctNumber: 30,
    correct: 70,
    win: 100,
};
class GuessWordController {
    PlayerAnswer(room, message, sessionId) {
        var answerPlayer = DataModel_1.DataModel.Parse(message.Data);
        if (answerPlayer.answer.length != room.roomConfig.legthPass) {
            return;
        }
        var clientData = room.clientDatas[sessionId];
        var player = room.state.players.get(sessionId);
        if (player == null || player == undefined) {
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.answer_inval;
            message.Data = "Not found player";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        if (player.status == StateGuessWord_1.StatusPlayer.Win) {
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.answer_inval;
            message.Data = "You win";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        if (player.numb >= room.roomConfig.maxAnswers) {
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.answer_inval;
            message.Data = "Wrong fomat answer";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        if (!CheckWord(answerPlayer.answer, room.roomConfig.legthPass)) {
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.answer_inval;
            message.Data = "Inval word";
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        var resultAnswerPlayer = new AnswerPlayer_1.ResultAnswerPlayer();
        var pos = +answerPlayer.pos;
        if (pos < player.numb) {
            resultAnswerPlayer.pos = clientData.hisAnswer.length - 1;
            resultAnswerPlayer.answer = clientData.hisAnswer[resultAnswerPlayer.pos];
            resultAnswerPlayer.result = clientData.hisResult[resultAnswerPlayer.pos];
        }
        else {
            var result = CheckResult(answerPlayer.answer, room.roomConfig.pass);
            if (player.correct.length == 0) {
                player.correct = result;
            }
            else {
                for (let index = 0; index < player.correct.length; index++) {
                    var oldR = +player.correct[index];
                    var newR = +result[index];
                    if (newR > oldR) {
                        player.correct = StringUtils_1.stringUtils.StringRepalce(player.correct, index, result[index]);
                    }
                }
            }
            var score = 0;
            for (let index = 0; index < player.correct.length; index++) {
                if (player.correct[index].toString() == exports.AnsCheck.correct) {
                    score += Score.correct;
                }
                else if (player.correct[index].toString() == exports.AnsCheck.correctNumber) {
                    score += Score.correctNumber;
                }
            }
            player.score = score;
            player;
            player.numb++;
            resultAnswerPlayer.pos = answerPlayer.pos;
            resultAnswerPlayer.answer = answerPlayer.answer;
            resultAnswerPlayer.result = result;
            clientData.hisAnswer.push(answerPlayer.answer);
            clientData.hisResult.push(result);
            var correctAns = "";
            for (let index = 0; index < room.roomConfig.legthPass; index++) {
                correctAns += exports.AnsCheck.correct;
            }
            if (player.numb >= room.roomConfig.maxAnswers) {
                player.status = StateGuessWord_1.StatusPlayer.Lose;
                resultAnswerPlayer.status = StateGuessWord_1.StatusPlayer.Lose;
                player.score += room.roomData.timeCount;
            }
            if (result == correctAns) {
                player.status = StateGuessWord_1.StatusPlayer.Win;
                resultAnswerPlayer.status = StateGuessWord_1.StatusPlayer.Win;
                player.score += Score.win;
                player.score += room.roomData.timeCount;
            }
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.result_answer;
            message.Data = JSON.stringify(resultAnswerPlayer);
            var messageData = new Message_1.MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            CheckEndGame(room, (bool) => {
                if (bool) {
                    room.roomData.timeCount = 0;
                }
            });
        }
    }
}
function CheckWord(word, length) {
    var str;
    if (length == 4) {
        str = WordService_1.wordService.fourWord.find((data) => (data == word));
    }
    if (str == null || str == undefined || str.length == 0) {
        return false;
    }
    else {
        return true;
    }
}
function CheckResult(answer, pass) {
    var result = "";
    for (let i = 0; i < answer.length; i++) {
        var check = exports.AnsCheck.wrong;
        for (let j = 0; j < pass.length; j++) {
            if (answer[i] == pass[j]) {
                if (i == j) {
                    check = exports.AnsCheck.correct;
                }
                else {
                    if (check == exports.AnsCheck.wrong)
                        check = exports.AnsCheck.correctNumber;
                }
            }
        }
        result += check;
    }
    return result;
}
function CheckEndGame(room, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var isDone = true;
        yield room.state.players.forEach((data) => {
            if (data.status == StateGuessWord_1.StatusPlayer.Do) {
                isDone = false;
                callback(false);
                return false;
            }
        });
        callback(isDone);
    });
}
exports.guessWordController = new GuessWordController();
