"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSpellingBeeRoom = exports.RoomSpellingBeeData = exports.RoomSpellingBeeConfig = exports.ClientDataSpellingBee = void 0;
const colyseus_1 = require("colyseus");
const StateSpellingBee_1 = require("./StateSpellingBee");
const DataModel_1 = require("../../../Utils/DataModel");
const Message_1 = require("../../../MessageServer/Model/Message");
const LogController_1 = require("../../../LogServer/Controller/LogController");
const SpellingBeeRouter_1 = require("../Router/SpellingBeeRouter");
const MessageSpellingBee_1 = require("./MessageSpellingBee");
const fs_1 = require("fs");
const __1 = require("../../../..");
const path_1 = __importDefault(require("path"));
class ClientDataSpellingBee {
    constructor() {
        this.hisAnswer = [];
    }
    resetData() {
        this.hisAnswer = [];
    }
}
exports.ClientDataSpellingBee = ClientDataSpellingBee;
class RoomSpellingBeeConfig {
    constructor() {
        this.words = [];
    }
}
exports.RoomSpellingBeeConfig = RoomSpellingBeeConfig;
const timeVar = {
    delayStart: 15,
    durationGame: 180,
    delay_time_over: 10,
};
const game_status = {
    game_start: 1,
    game_end: 0,
    time_over: 2,
};
class RoomSpellingBeeData {
    constructor() {
        this.timeCount = 0;
        this.sub = [];
        this.gameStatus = 0;
    }
}
exports.RoomSpellingBeeData = RoomSpellingBeeData;
const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g;
class StateSpellingBeeRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 5;
        this.roomConfig = new RoomSpellingBeeConfig();
        this.roomData = new RoomSpellingBeeData();
    }
    onCreate(options) {
        console.log("SpellingBeeRoom created!", options);
        this.inti();
        var state = new StateSpellingBee_1.StateSpellingBee();
        this.clientDatas = {};
        this.setState(state);
        this.onMessage("message", (client, data) => {
            LogController_1.logController.LogDev("Dev Recive: ", data);
            var message = DataModel_1.DataModel.Parse(data);
            SpellingBeeRouter_1.spellingBeeRouter.Router(this, message, client.sessionId);
        });
        this.delayedInterval = this.clock.setInterval(() => {
            this.roomData.timeCount--;
            this.checkTime();
        }, 1000);
    }
    inti() {
        this.roomConfig = new RoomSpellingBeeConfig();
        this.roomData = new RoomSpellingBeeData();
        this.roomData.timeCount = timeVar.delayStart;
        this.resetData();
    }
    resetData() {
        const result = (0, fs_1.readFileSync)(path_1.default.join(__1.rootDir + '/public/resources/guess_word/enwords.txt'), 'utf-8');
        var words = result.split(`\n`);
        for (let round = 0; round < 10000; round++) {
            this.roomConfig.words = [];
            this.roomData.sub = [];
            var index = 0;
            var index_1 = 0;
            var keys = "qwrtypsdfghjklzxcvbnm";
            var keysub = "ueoai";
            for (let i = 0; i < 5; i++) {
                let index = Math.floor(Math.random() * keys.length);
                this.roomData.sub.push(keys[index]);
                keys = keys.replace(keys[index], "");
            }
            for (let i = 0; i < 2; i++) {
                let index = Math.floor(Math.random() * keysub.length);
                this.roomData.sub.push(keysub[index]);
                keysub = keysub.replace(keysub[index], "");
            }
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
                        this.roomConfig.words.push(element);
                        index++;
                        if (element.length < 6) {
                            index_1++;
                        }
                    }
                }
            });
            if (index_1 >= 75) {
                break;
            }
        }
        console.log(this.roomData.sub, this.roomConfig.words.length);
    }
    onJoin(client, options) {
        LogController_1.logController.LogDev("Dev", options);
        var clientData = new ClientDataSpellingBee();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        LogController_1.logController.LogDev("Dev", options.Name, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.Name);
        var message = new Message_1.Message();
        message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.wait_other;
        if (this.roomData.gameStatus == game_status.game_start)
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.game_start;
        if (this.roomData.gameStatus == game_status.time_over)
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.time_over;
        var messageUdRoom = new Message_1.Message();
        messageUdRoom.MessageCode = MessageSpellingBee_1.MessageSpellingBee.update_room;
        messageUdRoom.Data = JSON.stringify(this.roomData);
        var messageData = new Message_1.MessageData([JSON.stringify(messageUdRoom), JSON.stringify(message)]);
        LogController_1.logController.LogDev("Dev", JSON.stringify(messageData));
        this.sendToClient(JSON.stringify(messageData), client);
        if (Object.keys(this.clientDatas).length >= this.maxClients) {
            this.roomData.timeCount = 0;
        }
    }
    onLeave(client) {
        LogController_1.logController.LogDev("Dev", client.sessionId, "left!");
        try {
            delete this.clientDatas[client.sessionId];
        }
        catch (error) {
            LogController_1.logController.LogDev("Dev error: ", error);
        }
        this.state.removePlayer(client.sessionId);
        if (Object.keys(this.clientDatas).length == 0) {
            this.roomData.timeCount = 0;
            // this.unlock();
        }
    }
    onDispose() {
        LogController_1.logController.LogDev("Dev Dispose StateHandlerRoom");
    }
    checkTime() {
        if (this.roomData.timeCount > 0)
            return;
        if (this.roomData.gameStatus == game_status.game_end) {
            LogController_1.logController.LogDev("Dev Game Start");
            this.lock();
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.game_start;
            this.roomData.timeCount = timeVar.durationGame;
            this.roomData.gameStatus = game_status.game_start;
            var messageUdRoom = new Message_1.Message();
            messageUdRoom.MessageCode = MessageSpellingBee_1.MessageSpellingBee.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if (this.roomData.gameStatus == game_status.game_start) {
            LogController_1.logController.LogDev("Dev Time over");
            this.roomData.timeCount = timeVar.delay_time_over;
            this.roomData.gameStatus = game_status.time_over;
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.time_over;
            var messageUdRoom = new Message_1.Message();
            messageUdRoom.MessageCode = MessageSpellingBee_1.MessageSpellingBee.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if (this.roomData.gameStatus == game_status.time_over) {
            var message = new Message_1.Message();
            message.MessageCode = MessageSpellingBee_1.MessageSpellingBee.out_room;
            this.sendToAllClient(JSON.stringify(message));
            for (let key in this.clientDatas) {
                let value = this.clientDatas[key];
                value.client.leave();
            }
            return;
            // this.roomData.timeCount = timeVar.delayStart;
            // this.roomData.gameStatus = game_status.game_end;
            // var message = new Message();
            // message.MessageCode = MessageGuessWord.game_end;
            // var messageUdRoom = new Message();
            // messageUdRoom.MessageCode = MessageGuessWord.update_room;
            // messageUdRoom.Data = JSON.stringify(this.roomData);
            // this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            // this.resetPlayer();
        }
    }
    sendToAllClient(...message) {
        for (let key in this.clientDatas) {
            try {
                let value = this.clientDatas[key];
                var messageData = new Message_1.MessageData(message);
                LogController_1.logController.LogDev("Dev", JSON.stringify(messageData));
                this.sendToClient(JSON.stringify(messageData), value.client);
            }
            catch (error) {
                LogController_1.logController.LogDev("Dev error:", error);
            }
        }
    }
    sendToClient(data, client) {
        client.send("message", data);
    }
    resetPlayer() {
        for (let key in this.clientDatas) {
            try {
                let value = this.clientDatas[key];
                value.resetData();
            }
            catch (error) {
                LogController_1.logController.LogDev("Dev error:", error);
            }
        }
        this.state.players.forEach(element => {
            element.resetData();
        });
    }
}
exports.StateSpellingBeeRoom = StateSpellingBeeRoom;
