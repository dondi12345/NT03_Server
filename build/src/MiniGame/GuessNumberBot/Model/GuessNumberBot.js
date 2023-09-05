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
exports.GuessNumberBot = void 0;
const colyseus_js_1 = require("colyseus.js");
const EnumUtils_1 = require("../../../Utils/EnumUtils");
const Message_1 = require("../../../MessageServer/Model/Message");
const DataModel_1 = require("../../../Utils/DataModel");
const MessageGuessNumber_1 = require("../../GuessNumber/Model/MessageGuessNumber");
const WordService_1 = require("../../GuessNumber/Service/WordService");
const AnswerPlayer_1 = require("../../GuessNumber/Model/AnswerPlayer");
const StateGuessNumber_1 = require("../../GuessNumber/Model/StateGuessNumber");
const GuessNumberController_1 = require("../../GuessNumber/Controller/GuessNumberController");
const LogController_1 = require("../../../LogServer/Controller/LogController");
var GuessNumberBotBehaviour;
(function (GuessNumberBotBehaviour) {
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["None"] = 0] = "None";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["FindingRoom"] = 1] = "FindingRoom";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["JoiningRoom"] = 2] = "JoiningRoom";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["RoomJoined"] = 3] = "RoomJoined";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["InGame"] = 4] = "InGame";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["Guessing"] = 5] = "Guessing";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["WaitAnswer"] = 6] = "WaitAnswer";
    GuessNumberBotBehaviour[GuessNumberBotBehaviour["WaitEndGame"] = 7] = "WaitEndGame";
})(GuessNumberBotBehaviour || (GuessNumberBotBehaviour = {}));
class ClientData {
    constructor() {
        this.hisAnswer = [];
        this.hisResult = [];
        this.status = 0;
    }
}
class GuessNumberBot {
    constructor() {
        this.behaviour = GuessNumberBotBehaviour.None;
        this.oldBehaviour = GuessNumberBotBehaviour.None;
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
        LogController_1.logController.LogDev("Dev New Step", this.namePlayer, EnumUtils_1.enumUtils.ToString(GuessNumberBotBehaviour, this.behaviour));
        if (this.behaviour == this.oldBehaviour) {
            this.countSame++;
            if (this.countSame >= 10) {
                this.behaviour = GuessNumberBotBehaviour.None;
            }
        }
        else {
            this.countSame = 0;
            this.oldBehaviour = this.behaviour;
        }
        switch (this.behaviour) {
            case GuessNumberBotBehaviour.None:
                this.behaviour = GuessNumberBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random() * 10 + 10);
                break;
            case GuessNumberBotBehaviour.FindingRoom:
                this.JoinRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
                break;
            case GuessNumberBotBehaviour.Guessing:
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
            this.client = new colyseus_js_1.Client("ws://localhost:3007");
            this.OutRoom();
            try {
                this.room = yield this.client.join("state_guess_number", { Name: this.namePlayer });
                this.room.onMessage("message", (data) => {
                    this.RecieveMessage(data);
                });
                LogController_1.logController.LogDev("Dev joined successfully", this.room.sessionId);
                this.behaviour = GuessNumberBotBehaviour.RoomJoined;
            }
            catch (e) {
                // logController.LogDev("Dev join error", e);
            }
            this.behaviour = GuessNumberBotBehaviour.None;
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
            if (message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.wait_other) {
                this.delayStep = 5;
                this.behaviour = GuessNumberBotBehaviour.InGame;
            }
            if (message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.out_room || message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.time_over) {
                this.behaviour = GuessNumberBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
            }
            if (message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.game_start) {
                this.behaviour = GuessNumberBotBehaviour.Guessing;
            }
            if (message.MessageCode == MessageGuessNumber_1.MessageGuessNumber.result_answer) {
                this.ReciveAnswer(message.Data);
            }
        }
    }
    GuessWorld() {
        LogController_1.logController.LogDev("Dev GuessWorld");
        var word = this.wordAvailables[Math.floor(Math.random() * this.wordAvailables.length)];
        var message = new Message_1.Message();
        message.MessageCode = MessageGuessNumber_1.MessageGuessNumber.player_answer;
        var answerPlayer = new AnswerPlayer_1.AnswerPlayer();
        answerPlayer.answer = word;
        answerPlayer.pos = this.clientData.hisAnswer.length;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = GuessNumberBotBehaviour.WaitAnswer;
    }
    ReciveAnswer(data) {
        this.delayStep = this.delayStep = Math.floor(Math.random() * 30 + 10);
        var resultAnswerPlayer = DataModel_1.DataModel.Parse(data);
        this.clientData.hisAnswer.push(resultAnswerPlayer.answer);
        this.clientData.hisResult.push(resultAnswerPlayer.result);
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if (resultAnswerPlayer.result[index].toString() == GuessNumberController_1.AnsCheck.wrong) {
                this.keyBroadUnavailable.push(resultAnswerPlayer.answer[index].toString());
            }
            else {
                this.keyBroadAvailable.push(resultAnswerPlayer.answer[index].toString());
            }
        }
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if (resultAnswerPlayer.result[index].toString() == GuessNumberController_1.AnsCheck.wrong) {
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
        if (this.clientData.status == StateGuessNumber_1.StatusPlayer.Win || this.clientData.status == StateGuessNumber_1.StatusPlayer.Lose) {
            this.behaviour = GuessNumberBotBehaviour.WaitEndGame;
            return;
        }
        else {
            this.behaviour = GuessNumberBotBehaviour.Guessing;
        }
    }
}
exports.GuessNumberBot = GuessNumberBot;
