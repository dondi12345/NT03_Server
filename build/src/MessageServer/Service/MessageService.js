"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageToSocket = exports.AddUserSocketDictionary = exports.InitMessageServerWithSocket = exports.userSocketDictionary = void 0;
const socket_io_1 = require("socket.io");
const Env_1 = require("../../Enviroment/Env");
const Message_1 = require("../Model/Message");
const UserSocket_1 = require("../../UserSocket/Model/UserSocket");
const redis_1 = require("redis");
const MessageCode_1 = require("../Model/MessageCode");
const UserSocketData_1 = require("../../UserSocket/Model/UserSocketData");
const LogController_1 = require("../../LogServer/Controller/LogController");
const MessageRouter_1 = require("../Router/MessageRouter");
const DataModel_1 = require("../../Utils/DataModel");
const TransferData_1 = require("../../TransferData");
const redisSubscriber = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
const redisAccountToken = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
const redisUserPlayerChannelSub = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
exports.userSocketDictionary = {};
function InitMessageServerWithSocket() {
    redisAccountToken.keys(Env_1.RedisConfig.KeyUserPlayerSession + '*', (error, keys) => {
        if (error) {
            console.error('Error retrieving keys:', error);
            return;
        }
        // If there are keys matching the pattern
        if (keys.length > 0) {
            // Delete the keys
            redisAccountToken.del(...keys, (error, deletedCount) => {
                if (error) {
                    console.error('Error deleting keys:', error);
                }
                else {
                    console.log('1685077153 Keys deleted:', deletedCount);
                }
            });
        }
        else {
            console.log('No keys found matching the pattern.');
        }
    });
    InitWithSocket();
}
exports.InitMessageServerWithSocket = InitMessageServerWithSocket;
function InitWithSocket() {
    const io = new socket_io_1.Server(Env_1.portConfig.portMessageServer);
    console.log(`Dev 1684424393 Worker ${process.pid} listening to MessageServer on port: ${Env_1.portConfig.portMessageServer}`);
    io.on(Env_1.variable.eventSocketConnection, (socket) => {
        console.log("Dev 1684424410 " + socket.id + " connec to MessageServer");
        let userSocket = new UserSocket_1.UserSocket();
        socket.on(Env_1.SocketConfig.Listening, (data) => {
            LogController_1.logController.LogDev("Dev 1684424442", data);
            var message = DataModel_1.DataModel.Parse(data);
            var transferData = new TransferData_1.TransferData();
            transferData.Socket = socket;
            transferData.Token = message.Token;
            MessageRouter_1.messageRouter.Router(message, transferData);
        });
        socket.on("disconnect", () => {
            console.log("Dev 1685025149 " + socket.id + " left MessageServer");
            try {
                console.log("Dev 1685086000 ");
                redisAccountToken.del(Env_1.RedisConfig.KeyUserPlayerSession + userSocket.IdUserPlayer, () => { });
            }
            catch (error) {
                console.log("Dev 1685080913 " + error);
            }
            try {
                delete exports.userSocketDictionary[userSocket.IdUserPlayer.toString()];
            }
            catch (error) {
                console.log("Dev 1684903275 " + error);
            }
        });
    });
    // redisSubscriber.subscribe(variable.worker);
    // redisSubscriber.on(variable.messageServer, (channel, data) => {
    //     var message = Message.Parse(data);
    //     MessageRouter(message);
    // });
    redisUserPlayerChannelSub.subscribe(Env_1.RedisConfig.UserPlayerChannel);
    redisUserPlayerChannelSub.on('message', (channel, data) => {
        console.log("Dev 1685078357" + data);
        var message = Message_1.Message.Parse(data);
        if (message.MessageCode == MessageCode_1.MessageCode.MessageServer_Disconnect) {
            try {
                var userSocketData = UserSocketData_1.UserSocketData.Parse(message.Data);
                console.log("Dev 1685077463 Disconnect: " + userSocketData.IdUserPlayer.toString());
                exports.userSocketDictionary[userSocketData.IdUserPlayer.toString()].Socket.disconnect();
            }
            catch (error) {
                console.log("Dev 1685074144 " + error);
            }
        }
    });
}
function AddUserSocketDictionary(userSocket) {
    exports.userSocketDictionary[userSocket.IdUserPlayer.toString()] = userSocket;
}
exports.AddUserSocketDictionary = AddUserSocketDictionary;
function SendMessageToSocket(message, socket) {
    try {
        socket.emit(Env_1.variable.eventSocketListening, JSON.stringify(message));
    }
    catch (error) {
        console.log("Dev 1684765923 " + error);
    }
}
exports.SendMessageToSocket = SendMessageToSocket;
