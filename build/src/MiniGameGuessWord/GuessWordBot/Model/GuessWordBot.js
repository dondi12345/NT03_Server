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
exports.GuessWordBot = void 0;
const colyseus_js_1 = require("colyseus.js");
const MessageGuessWord_1 = require("../../GuessWord/Model/MessageGuessWord");
const WordService_1 = require("../../GuessWord/Service/WordService");
const AnswerPlayer_1 = require("../../GuessWord/Model/AnswerPlayer");
const StateGuessWord_1 = require("../../GuessWord/Model/StateGuessWord");
const GuessWordController_1 = require("../../GuessWord/Controller/GuessWordController");
const EnumUtils_1 = require("../../../Utils/EnumUtils");
const LogController_1 = require("../../../LogServer/Controller/LogController");
const DataModel_1 = require("../../../Utils/DataModel");
const Message_1 = require("../../../MessageServer/Model/Message");
const Env_1 = require("../../../Enviroment/Env");
var GuessWordBotBehaviour;
(function (GuessWordBotBehaviour) {
    GuessWordBotBehaviour[GuessWordBotBehaviour["None"] = 0] = "None";
    GuessWordBotBehaviour[GuessWordBotBehaviour["FindingRoom"] = 1] = "FindingRoom";
    GuessWordBotBehaviour[GuessWordBotBehaviour["JoiningRoom"] = 2] = "JoiningRoom";
    GuessWordBotBehaviour[GuessWordBotBehaviour["RoomJoined"] = 3] = "RoomJoined";
    GuessWordBotBehaviour[GuessWordBotBehaviour["InGame"] = 4] = "InGame";
    GuessWordBotBehaviour[GuessWordBotBehaviour["Guessing"] = 5] = "Guessing";
    GuessWordBotBehaviour[GuessWordBotBehaviour["WaitAnswer"] = 6] = "WaitAnswer";
    GuessWordBotBehaviour[GuessWordBotBehaviour["WaitEndGame"] = 7] = "WaitEndGame";
})(GuessWordBotBehaviour || (GuessWordBotBehaviour = {}));
class ClientData {
    constructor() {
        this.hisAnswer = [];
        this.hisResult = [];
        this.status = 0;
    }
}
class GuessWordBot {
    constructor() {
        this.behaviour = GuessWordBotBehaviour.None;
        this.oldBehaviour = GuessWordBotBehaviour.None;
        this.countSame = 0;
        this.delayStep = 1;
    }
    Start() {
        var rand = Math.floor(Math.random() * 900 + 100);
        this.namePlayer = "Bot" + rand;
        this.Step();
        this.delayStep = Math.floor(Math.random() * 15 + 4);
    }
    Step() {
        LogController_1.logController.LogDev("Dev New Step", this.namePlayer, EnumUtils_1.enumUtils.ToString(GuessWordBotBehaviour, this.behaviour));
        if (this.behaviour == this.oldBehaviour) {
            this.countSame++;
            if (this.countSame >= 10) {
                this.behaviour = GuessWordBotBehaviour.None;
            }
        }
        else {
            this.countSame = 0;
            this.oldBehaviour = this.behaviour;
        }
        switch (this.behaviour) {
            case GuessWordBotBehaviour.None:
                this.behaviour = GuessWordBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random() * 10 + 10);
                break;
            case GuessWordBotBehaviour.FindingRoom:
                this.JoinRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
                break;
            case GuessWordBotBehaviour.Guessing:
                this.GuessWorld();
                break;
            default:
                this.delayStep = 3;
                break;
        }
        setTimeout(() => {
            this.Step();
        }, this.delayStep * 1000);
    }
    JoinRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogDev("Dev Join room", this.namePlayer);
            this.clientData = new ClientData();
            this.client = new colyseus_js_1.Client("ws://localhost:" + Env_1.portConfig.portMiniGameWord);
            this.OutRoom();
            try {
                this.room = yield this.client.join("state_guess_number", { Name: this.namePlayer });
                this.room.onMessage("message", (data) => {
                    this.RecieveMessage(data);
                });
                LogController_1.logController.LogDev("Dev joined successfully", this.room.sessionId);
                this.behaviour = GuessWordBotBehaviour.RoomJoined;
            }
            catch (e) {
                // logController.LogDev("Dev join error", e);
            }
            this.behaviour = GuessWordBotBehaviour.None;
            this.wordAvailables = [];
            this.keyBroadAvailable = [];
            this.keyBroadUnavailable = [];
            for (let index = 0; index < WordService_1.wordService.fourWord.length; index++) {
                this.wordAvailables.push(WordService_1.wordService.fourWord[index]);
            }
        });
    }
    OutRoom() {
        try {
            this.room.leave();
        }
        catch (error) {
        }
    }
    RecieveMessage(data) {
        var messageData = DataModel_1.DataModel.Parse(data);
        LogController_1.logController.LogDev("Dev Recive: ", this.namePlayer, messageData.Data);
        for (let index = 0; index < messageData.Data.length; index++) {
            var message = DataModel_1.DataModel.Parse(messageData.Data[index]);
            if (message.MessageCode == MessageGuessWord_1.MessageGuessWord.wait_other) {
                this.delayStep = 5;
                this.behaviour = GuessWordBotBehaviour.InGame;
            }
            if (message.MessageCode == MessageGuessWord_1.MessageGuessWord.out_room || message.MessageCode == MessageGuessWord_1.MessageGuessWord.time_over) {
                this.behaviour = GuessWordBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
            }
            if (message.MessageCode == MessageGuessWord_1.MessageGuessWord.game_start) {
                this.behaviour = GuessWordBotBehaviour.Guessing;
            }
            if (message.MessageCode == MessageGuessWord_1.MessageGuessWord.result_answer) {
                this.ReciveAnswer(message.Data);
            }
        }
    }
    GuessWorld() {
        LogController_1.logController.LogDev("Dev GuessWorld");
        var word = this.wordAvailables[Math.floor(Math.random() * this.wordAvailables.length)];
        var message = new Message_1.Message();
        message.MessageCode = MessageGuessWord_1.MessageGuessWord.player_answer;
        var answerPlayer = new AnswerPlayer_1.AnswerPlayer();
        answerPlayer.answer = word;
        answerPlayer.pos = this.clientData.hisAnswer.length;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = GuessWordBotBehaviour.WaitAnswer;
    }
    ReciveAnswer(data) {
        this.delayStep = this.delayStep = Math.floor(Math.random() * 30 + 10);
        var resultAnswerPlayer = DataModel_1.DataModel.Parse(data);
        this.clientData.hisAnswer.push(resultAnswerPlayer.answer);
        this.clientData.hisResult.push(resultAnswerPlayer.result);
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if (resultAnswerPlayer.result[index].toString() == GuessWordController_1.AnsCheck.wrong) {
                this.keyBroadUnavailable.push(resultAnswerPlayer.answer[index].toString());
            }
            else {
                this.keyBroadAvailable.push(resultAnswerPlayer.answer[index].toString());
            }
        }
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if (resultAnswerPlayer.result[index].toString() == GuessWordController_1.AnsCheck.wrong) {
                this.keyBroadUnavailable.push(resultAnswerPlayer.answer[index].toString());
            }
            else {
                this.keyBroadAvailable.push(resultAnswerPlayer.answer[index].toString());
            }
        }
        for (let index = this.wordAvailables.length - 1; index >= 0; index--) {
            var remove = false;
            for (let i = 0; i < this.keyBroadUnavailable.length; i++) {
                if (this.wordAvailables[index].indexOf(this.keyBroadUnavailable[i]) > -1) {
                    remove = true;
                    break;
                }
            }
            if (remove == true) {
                this.wordAvailables.splice(index, 1);
                continue;
            }
            remove = false;
            for (let i = 0; i < this.keyBroadAvailable.length; i++) {
                if (this.wordAvailables[index].indexOf(this.keyBroadAvailable[i]) == -1) {
                    remove = true;
                    break;
                }
            }
            if (remove == true) {
                this.wordAvailables.splice(index, 1);
                continue;
            }
        }
        this.clientData.status = resultAnswerPlayer.status;
        if (this.clientData.status == StateGuessWord_1.StatusPlayer.Win || this.clientData.status == StateGuessWord_1.StatusPlayer.Lose) {
            this.behaviour = GuessWordBotBehaviour.WaitEndGame;
            return;
        }
        else {
            this.behaviour = GuessWordBotBehaviour.Guessing;
        }
    }
}
exports.GuessWordBot = GuessWordBot;
