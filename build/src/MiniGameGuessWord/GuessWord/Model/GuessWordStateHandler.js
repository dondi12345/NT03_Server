"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateGuessWordRoom = exports.RoomData = exports.RoomGuessWordConfig = exports.ClientData = void 0;
const colyseus_1 = require("colyseus");
const StateGuessWord_1 = require("./StateGuessWord");
const GuessWordRouter_1 = require("../Router/GuessWordRouter");
const DataModel_1 = require("../../../Utils/DataModel");
const Message_1 = require("../../../MessageServer/Model/Message");
const MessageGuessWord_1 = require("./MessageGuessWord");
const WordService_1 = require("../Service/WordService");
const LogController_1 = require("../../../LogServer/Controller/LogController");
class ClientData {
    constructor() {
        this.hisAnswer = [];
        this.hisResult = [];
    }
    resetData() {
        this.hisAnswer = [];
        this.hisResult = [];
    }
}
exports.ClientData = ClientData;
class RoomGuessWordConfig {
}
exports.RoomGuessWordConfig = RoomGuessWordConfig;
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
class RoomData {
    constructor() {
        this.timeCount = 0;
        this.gameStatus = 0;
    }
}
exports.RoomData = RoomData;
class StateGuessWordRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 5;
        this.roomConfig = new RoomGuessWordConfig();
        this.roomData = new RoomData();
    }
    onCreate(options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessWord_1.StateGuessWord();
        this.clientDatas = {};
        this.setState(state);
        this.onMessage("message", (client, data) => {
            LogController_1.logController.LogDev("Dev Recive: ", data);
            var message = DataModel_1.DataModel.Parse(data);
            GuessWordRouter_1.guessWordRouter.Router(this, message, client.sessionId);
        });
        this.delayedInterval = this.clock.setInterval(() => {
            this.roomData.timeCount--;
            this.checkTime();
        }, 1000);
    }
    inti() {
        this.roomConfig = new RoomGuessWordConfig();
        this.roomConfig.legthPass = 4;
        this.roomConfig.maxAnswers = 5;
        this.roomData = new RoomData();
        this.roomData.timeCount = timeVar.delayStart;
        this.resetData();
    }
    resetData() {
        this.roomConfig.pass = "";
        switch (this.roomConfig.legthPass) {
            default:
                this.roomConfig.pass = WordService_1.wordService.fourWord[Math.floor(Math.random() * WordService_1.wordService.fourWord.length)];
                break;
        }
        console.log("Pass: ", this.roomConfig.pass);
    }
    onJoin(client, options) {
        LogController_1.logController.LogDev("Dev", options);
        var clientData = new ClientData();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        LogController_1.logController.LogDev("Dev", options.Name, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.Name);
        var message = new Message_1.Message();
        message.MessageCode = MessageGuessWord_1.MessageGuessWord.wait_other;
        if (this.roomData.gameStatus == game_status.game_start)
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.game_start;
        if (this.roomData.gameStatus == game_status.time_over)
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.time_over;
        var messageUdRoom = new Message_1.Message();
        messageUdRoom.MessageCode = MessageGuessWord_1.MessageGuessWord.update_room;
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
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.game_start;
            this.roomData.timeCount = timeVar.durationGame;
            this.roomData.gameStatus = game_status.game_start;
            var messageUdRoom = new Message_1.Message();
            messageUdRoom.MessageCode = MessageGuessWord_1.MessageGuessWord.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if (this.roomData.gameStatus == game_status.game_start) {
            LogController_1.logController.LogDev("Dev Time over");
            this.roomData.timeCount = timeVar.delay_time_over;
            this.roomData.gameStatus = game_status.time_over;
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.time_over;
            message.Data = this.roomConfig.pass;
            var messageUdRoom = new Message_1.Message();
            messageUdRoom.MessageCode = MessageGuessWord_1.MessageGuessWord.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if (this.roomData.gameStatus == game_status.time_over) {
            var message = new Message_1.Message();
            message.MessageCode = MessageGuessWord_1.MessageGuessWord.out_room;
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
exports.StateGuessWordRoom = StateGuessWordRoom;
