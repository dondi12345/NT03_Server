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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellingBeeBot = void 0;
const colyseus_js_1 = require("colyseus.js");
const EnumUtils_1 = require("../../../Utils/EnumUtils");
const LogController_1 = require("../../../LogServer/Controller/LogController");
const DataModel_1 = require("../../../Utils/DataModel");
const Message_1 = require("../../../MessageServer/Model/Message");
const Env_1 = require("../../../Enviroment/Env");
const MessageSpellingBee_1 = require("../../SpellingBee/Model/MessageSpellingBee");
const AnswerSpellingBee_1 = require("../../SpellingBee/Model/AnswerSpellingBee");
const fs_1 = require("fs");
const __1 = require("../../../..");
const path_1 = __importDefault(require("path"));
var SpellingBeeBotBehaviour;
(function (SpellingBeeBotBehaviour) {
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["None"] = 0] = "None";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["FindingRoom"] = 1] = "FindingRoom";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["JoiningRoom"] = 2] = "JoiningRoom";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["RoomJoined"] = 3] = "RoomJoined";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["InGame"] = 4] = "InGame";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["Guessing"] = 5] = "Guessing";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["WaitAnswer"] = 6] = "WaitAnswer";
    SpellingBeeBotBehaviour[SpellingBeeBotBehaviour["WaitEndGame"] = 7] = "WaitEndGame";
})(SpellingBeeBotBehaviour || (SpellingBeeBotBehaviour = {}));
class ClientData {
    constructor() {
        this.answers = [];
        this.words = [];
    }
}
const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g;
class SpellingBeeBot {
    constructor() {
        this.behaviour = SpellingBeeBotBehaviour.None;
        this.oldBehaviour = SpellingBeeBotBehaviour.None;
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
        LogController_1.logController.LogDev("Dev New Step", this.namePlayer, EnumUtils_1.enumUtils.ToString(SpellingBeeBotBehaviour, this.behaviour));
        if (this.behaviour == this.oldBehaviour) {
            this.countSame++;
            if (this.countSame >= 10) {
                this.behaviour = SpellingBeeBotBehaviour.None;
            }
        }
        else {
            this.countSame = 0;
            this.oldBehaviour = this.behaviour;
        }
        switch (this.behaviour) {
            case SpellingBeeBotBehaviour.None:
                this.behaviour = SpellingBeeBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random() * 10 + 10);
                break;
            case SpellingBeeBotBehaviour.FindingRoom:
                this.JoinRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
                break;
            case SpellingBeeBotBehaviour.Guessing:
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
                this.room = yield this.client.join("state_spelling_bee", { Name: this.namePlayer });
                this.room.onMessage("message", (data) => {
                    this.RecieveMessage(data);
                });
                LogController_1.logController.LogDev("Dev joined successfully", this.room.sessionId);
                this.behaviour = SpellingBeeBotBehaviour.RoomJoined;
            }
            catch (e) {
                // logController.LogDev("Dev join error", e);
            }
            this.behaviour = SpellingBeeBotBehaviour.None;
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
            if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.update_room) {
                this.roomData = DataModel_1.DataModel.Parse(message.Data);
            }
            if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.wait_other) {
                this.delayStep = 5;
                this.behaviour = SpellingBeeBotBehaviour.InGame;
            }
            if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.out_room || message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.time_over) {
                this.behaviour = SpellingBeeBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5);
            }
            if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.game_start) {
                this.behaviour = SpellingBeeBotBehaviour.Guessing;
            }
            if (message.MessageCode == MessageSpellingBee_1.MessageSpellingBee.result_answer) {
                this.ReciveAnswer(message.Data);
            }
        }
    }
    GuessWorld() {
        LogController_1.logController.LogDev("Dev GuessWorld");
        if (this.clientData.words.length == 0) {
            this.InitWord();
        }
        var word = this.clientData.words[Math.floor(Math.random() * this.clientData.words.length)];
        var message = new Message_1.Message();
        message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.player_answer;
        var answerPlayer = new AnswerSpellingBee_1.AnswerSpellingBee();
        answerPlayer.answer = word;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = SpellingBeeBotBehaviour.WaitAnswer;
    }
    InitWord() {
        const result = (0, fs_1.readFileSync)(path_1.default.join(__1.rootDir + '/public/resources/guess_word/enwords.txt'), 'utf-8');
        var words = result.split(`\n`);
        words.forEach(element => {
            element = element.toLowerCase();
            element = element.replace(LINE_EXPRESSION, '');
            var same = false;
            for (let index = 0; index < element.length; index++) {
                if (element[index].toString() == this.roomData.sub[0]) {
                    same = true;
                    break;
                }
            }
            if (same == true) {
                var done = true;
                for (let index = 0; index < element.length; index++) {
                    var same_1 = false;
                    for (let i = 0; i < this.roomData.sub.length; i++) {
                        if (element[index].toString() == this.roomData.sub[i]) {
                            same_1 = true;
                            break;
                        }
                    }
                    if (same_1 == false) {
                        done = false;
                        break;
                    }
                }
                if (done == true) {
                    this.clientData.words.push(element);
                }
            }
        });
    }
    ReciveAnswer(data) {
        var numb = 0;
        if (this.clientData.answers.length > 10) {
            numb = 10;
        }
        if (this.clientData.answers.length > 20) {
            numb = 20;
        }
        if (this.clientData.answers.length > 30) {
            numb = 30;
        }
        this.delayStep = this.delayStep = Math.floor(Math.random() * numb + 10);
        var resultAnswerPlayer = DataModel_1.DataModel.Parse(data);
        this.clientData.answers = resultAnswerPlayer.answers;
        const index = this.clientData.words.indexOf(resultAnswerPlayer.answers[resultAnswerPlayer.answers.length - 1], 0);
        this.clientData.words.splice(index, 1);
        this.behaviour = SpellingBeeBotBehaviour.Guessing;
    }
}
exports.SpellingBeeBot = SpellingBeeBot;
