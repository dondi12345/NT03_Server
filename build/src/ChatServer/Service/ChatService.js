"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendToSocketById = exports.SendToSocket = exports.InitChatServer = exports.isChatServerUseSocket = exports.userSocketChatServer = void 0;
const socket_io_1 = require("socket.io");
const Env_1 = require("../../Enviroment/Env");
const redis_1 = require("redis");
const ChatRouter_1 = require("../Router/ChatRouter");
const MSGChat_1 = require("../Model/MSGChat");
const redisSubscriber = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
function InitChatServer() {
    InitWithSocket();
    // InitWithMessageServer();
    redisSubscriber.subscribe(Env_1.variable.chatServer);
    redisSubscriber.on('message', (channel, data) => {
        var msgChat = MSGChat_1.MSGChat.Parse(data);
        console.log("Dev 1684603001 Listent " + JSON.stringify(msgChat));
        (0, ChatRouter_1.ChatRouterWithoutSocket)(msgChat);
    });
}
exports.InitChatServer = InitChatServer;
function InitWithSocket() {
    exports.isChatServerUseSocket = true;
    exports.userSocketChatServer = {};
    const io = new socket_io_1.Server(Env_1.portConfig.portChatServer);
    console.log(`Dev 1684563910 Worker ${process.pid} listening to ChatServer on port: ${Env_1.portConfig.portChatServer}`);
    io.on(Env_1.variable.eventSocketConnection, (socket) => {
        console.log("Dev 1684563926 Socket connect to ChatServer");
        socket.on(Env_1.variable.eventSocketListening, (data) => {
            var msgChat = MSGChat_1.MSGChat.Parse(data);
            console.log("Dev 1684564028:" + JSON.stringify(msgChat));
            try {
                exports.userSocketChatServer[msgChat.IdUserPlayer.toString()] = socket;
            }
            catch (error) {
                console.log("Dev 1684642664 " + error);
            }
            (0, ChatRouter_1.ChatRouter)(msgChat, socket);
        });
    });
}
function SendToSocket(msgChat, socket) {
    try {
        socket.emit(Env_1.variable.eventSocketListening, msgChat);
    }
    catch (error) {
        console.log("Dev 1684665082 " + error);
    }
}
exports.SendToSocket = SendToSocket;
function SendToSocketById(idUserPlayer, msgChat) {
    try {
        var socket = exports.userSocketChatServer[idUserPlayer].emit(Env_1.variable.eventSocketListening, msgChat);
    }
    catch (error) {
    }
}
exports.SendToSocketById = SendToSocketById;
