"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendToSocketById = exports.SendToSocket = exports.InitUserPlayerServer = exports.userSocketUserPlayerServer = void 0;
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const Env_1 = require("../../Other/Env");
const MSGUserPlayer_1 = require("../Model/MSGUserPlayer");
var isUserPlayerServerUseSocket;
function InitUserPlayerServer() {
    InitWithMessageServer();
}
exports.InitUserPlayerServer = InitUserPlayerServer;
function InitWithMessageServer() {
    isUserPlayerServerUseSocket = false;
    exports.userSocketUserPlayerServer = MessageService_1.userSocketMessageServer;
}
function SendToSocket(msgUserPlayer, socket) {
    var msg;
    if (isUserPlayerServerUseSocket) {
        msg = MSGUserPlayer_1.MSGUserPlayer.ToString(msgUserPlayer);
    }
    else {
        msg = UserPlayerServerFormatToMessageServer(msgUserPlayer);
    }
    try {
        socket.emit(Env_1.variable.eventSocketListening, msg);
    }
    catch (error) {
        console.log("1684665082 " + error);
    }
}
exports.SendToSocket = SendToSocket;
function SendToSocketById(idUserPlayer, msgUserPlayer) {
}
exports.SendToSocketById = SendToSocketById;
function UserPlayerServerFormatToMessageServer(msgUserPlayer) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.Message_UserPlayer;
    if (msgUserPlayer.IdUserPlayer)
        message.IdUserPlayer = msgUserPlayer.IdUserPlayer;
    message.Data = MSGUserPlayer_1.MSGUserPlayer.ToString(msgUserPlayer);
    return JSON.stringify(message);
}
