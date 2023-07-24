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
exports.UpdateUserPlayerCtrl = exports.CheckUserLoginedFromRedis = exports.addAccountTokenToRedis = exports.UserPlayerLogin = void 0;
const redis_1 = __importDefault(require("redis"));
const UserChatChannel_1 = require("../../ChatServer/Model/UserChatChannel");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const ServerGame_1 = require("../Model/ServerGame");
const ServerGameCode_1 = require("../Model/ServerGameCode");
const UserPlayer_1 = require("../Model/UserPlayer");
const Env_1 = require("../../Enviroment/Env");
const UserSocketData_1 = require("../../UserSocket/Model/UserSocketData");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
const redisUserPlayerSession = redis_1.default.createClient();
const redisPub = redis_1.default.createClient();
function UserPlayerLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverGame = ServerGame_1.ServerGame.Parse(message.Data);
        if (!(serverGame.ServerGameCode in ServerGameCode_1.ServerGameCode))
            return;
        yield (0, UserPlayer_1.FindByIdAccountAndServerGameCode)(userSocket.IdAccount, serverGame.ServerGameCode).then(res => {
            if (res == null || res == undefined) {
                var userPlayer = UserPlayer_1.UserPlayer.NewUserPlayer(userSocket.IdAccount, serverGame.ServerGameCode);
                (0, UserPlayer_1.CreateUserPlayer)(userPlayer).then(res => {
                    if (res == null || res == undefined) {
                        (0, MessageService_1.SendMessageToSocket)(LoginFailMessage("User create fail"), userSocket.Socket);
                        return;
                    }
                    else {
                        userPlayer = UserPlayer_1.UserPlayer.Parse(res);
                        CheckUserLoginedFromRedis(userPlayer, userSocket);
                        InitNewUserPlayer(userPlayer);
                        return;
                    }
                });
            }
            else {
                userPlayer = UserPlayer_1.UserPlayer.Parse(res);
                CheckUserLoginedFromRedis(userPlayer, userSocket);
                return;
            }
        });
    });
}
exports.UserPlayerLogin = UserPlayerLogin;
function InitNewUserPlayer(userPlayer) {
    (0, UserChatChannel_1.UserJoinToGlobalChannel)(userPlayer._id, userPlayer.ServerGameCode);
}
function LoginFailMessage(error) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_LoginFail;
    message.Data = error;
    return message;
}
function LoginSuccessMessage(userPlayer) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_LoginSuccess;
    message.Data = JSON.stringify(userPlayer);
    return message;
}
function addAccountTokenToRedis(idUserPlayer, token) {
    redisUserPlayerSession.set(Env_1.Redis.KeyUserPlayerSession + idUserPlayer, token, (error, result) => {
        if (error) {
            console.error('1685008521 Failed to save token:', error);
        }
        else {
            console.log(`Dev 1685008516 Token added ${result}: `, token);
        }
    });
}
exports.addAccountTokenToRedis = addAccountTokenToRedis;
function CheckUserLoginedFromRedis(userPlayer, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisUserPlayerSession.get(Env_1.Redis.KeyUserPlayerSession + userPlayer._id.toString(), (error, result) => {
            console.log("Dev 1685077900 " + result);
            if (error || result == null || result == undefined) {
                userSocket.IdUserPlayer = userPlayer._id;
                addAccountTokenToRedis(userSocket.IdUserPlayer.toString(), userSocket.IdAccount.toString());
                (0, MessageService_1.AddUserSocketDictionary)(userSocket);
                console.log("Dev 1685080451 " + Object.keys(MessageService_1.userSocketDictionary).length);
                userSocket.UserPlayer = userPlayer;
                (0, MessageService_1.SendMessageToSocket)(LoginSuccessMessage(userPlayer), userSocket.Socket);
            }
            else {
                var message = new Message_1.Message();
                message.MessageCode = MessageCode_1.MessageCode.MessageServer_Disconnect;
                var userSocketData = new UserSocketData_1.UserSocketData();
                userSocketData.IdUserPlayer = userPlayer._id;
                userSocketData.IdSocket = userSocket.Socket.id;
                message.Data = JSON.stringify(userSocketData);
                console.log(JSON.stringify(message));
                userSocket.Socket.disconnect();
                redisPub.publish(Env_1.Redis.UserPlayerChannel, JSON.stringify(message));
            }
        });
    });
}
exports.CheckUserLoginedFromRedis = CheckUserLoginedFromRedis;
function UpdateUserPlayerCtrl(userSocket) {
    (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.UserPlayerServer_UpdateUserPlayer, userSocket, "", LogModel_1.LogType.Normal);
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_Update;
    message.Data = JSON.stringify(userSocket.UserPlayer);
    (0, UserPlayer_1.UpdateUserPlayer)(userSocket.UserPlayer);
    (0, MessageService_1.SendMessageToSocket)(message, userSocket.Socket);
}
exports.UpdateUserPlayerCtrl = UpdateUserPlayerCtrl;
