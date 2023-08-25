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
exports.userPlayerController = void 0;
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const ServerGameCode_1 = require("../Model/ServerGameCode");
const UserPlayer_1 = require("../Model/UserPlayer");
const Env_1 = require("../../Enviroment/Env");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const TockenController_1 = require("../../Token/Controller/TockenController");
const DataModel_1 = require("../../Utils/DataModel");
const mongoose_1 = require("mongoose");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const UserPlayerService_1 = require("../Service/UserPlayerService");
const TokenUserPlayer_1 = require("../../Token/Model/TokenUserPlayer");
const TokenModel_1 = require("../../Token/Model/TokenModel");
const DateUtils_1 = require("../../Utils/DateUtils");
function LoginFailMessage(error) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_LoginFail;
    message.Data = error;
    return message;
}
class UserPlayerController {
    UserPlayerLogin(message, transferData) {
        var data = TockenController_1.tokenController.AuthenVerify(transferData.Token);
        if (data == null || data == undefined) {
            LogController_1.logController.LogDev("1684937265 wrong token");
            LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", transferData.Token);
            transferData.Send(JSON.stringify(LoginFailMessage("Token authen fail")));
            return;
        }
        else {
            var tokenAccount = DataModel_1.DataModel.Parse(data);
            var serverGame = DataModel_1.DataModel.Parse(message.Data);
            if (!(serverGame.ServerGameCode in ServerGameCode_1.ServerGameCode)) {
                LogController_1.logController.LogDev("1684937276 Doesn't have ServerGame");
                LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_LoginFail, "Doesn't have ServerGame", transferData.Token);
                transferData.Send(JSON.stringify(LoginFailMessage("Token authen fail")));
                return;
            }
            (0, UserPlayer_1.FindByIdAccountAndServerGameCode)(new mongoose_1.Types.ObjectId(tokenAccount.IdAccount), serverGame.ServerGameCode).then(res => {
                if (res == null || res == undefined) {
                    var userPlayer = UserPlayer_1.UserPlayer.NewUserPlayer(new mongoose_1.Types.ObjectId(tokenAccount.IdAccount), serverGame.ServerGameCode);
                    (0, UserPlayer_1.CreateUserPlayer)(userPlayer).then(res => {
                        if (res == null || res == undefined) {
                            LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_CreateFail, "Create Fail", transferData.Token);
                            transferData.Send(JSON.stringify(LoginFailMessage("Create Fail")));
                            return;
                        }
                        else {
                            userPlayer = UserPlayer_1.UserPlayer.Parse(res);
                            UserPlayerLoginSuccess(userPlayer, transferData, tokenAccount);
                            return;
                        }
                    }).catch(err => {
                        LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_CreateFail, err, transferData.Token);
                        transferData.Send(JSON.stringify(LoginFailMessage("Create Fail")));
                    });
                }
                else {
                    var userPlayer = UserPlayer_1.UserPlayer.Parse(res);
                    UserPlayerLoginSuccess(userPlayer, transferData, tokenAccount);
                    return;
                }
            }).catch(err => {
                LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_CreateFail, err, transferData.Token);
                transferData.Send(JSON.stringify(LoginFailMessage(err)));
            });
        }
    }
    UserPlayerLogout(message) {
        LogController_1.logController.LogDev("1685077911 UserPlayerLogout");
        var userPlayerWithToken = DataModel_1.DataModel.Parse(message.Data);
        var userPlayer = UserPlayerService_1.userPlayerLoginCache[userPlayerWithToken.UserPlayerId];
        if (userPlayer == null || userPlayer == undefined)
            return;
        if (userPlayer.Token != userPlayerWithToken.Token && userPlayer.Socket != null && userPlayer.Socket != undefined) {
            userPlayer.Socket.disconnect();
        }
    }
    GetUserPlayerCached(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var userPlayer = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                var data = DataModel_1.DataModel.Parse(TockenController_1.tokenController.AuthenVerify(token));
                if (data == null || data == undefined) {
                    LogController_1.logController.LogDev("1684937265 wrong token");
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", token);
                    reslove(null);
                }
                else {
                    RedisConnect_1.redisClient.get(Env_1.RedisKeyConfig.KeyUserPlayerData(data.IdUserPlayer), (error, result) => {
                        if (error) {
                            LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_RedisGetUserPlayerFail, error, token);
                            reslove(null);
                        }
                        else {
                            reslove(result);
                        }
                    });
                }
            }));
            if (userPlayer == null || userPlayer == undefined) {
                return null;
            }
            return DataModel_1.DataModel.Parse(userPlayer);
        });
    }
    SetUserPlayerCached(token, userPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = DataModel_1.DataModel.Parse(TockenController_1.tokenController.AuthenVerify(token));
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                LogController_1.logController.LogDev("1684937367 wrong token");
                LogController_1.logController.LogWarring(LogCode_1.LogCode.Currency__AuthenTokenFail, "Token authen fail", token);
            }
            else {
                RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyUserPlayerData(tokenUserPlayer.IdUserPlayer), JSON.stringify(userPlayer));
            }
        });
    }
    UserPlayerChangeAdd(data, token) {
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(token);
            if (tokenUserPlayer == null)
                return null;
            var userPlayer;
            yield UserPlayer_1.UserPlayerModel.updateOne({
                _id: tokenUserPlayer.IdUserPlayer
            }, {
                $inc: data
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_ChangeAddSuc, res, token);
                if (res.modifiedCount == 0 && res.matchedCount == 0) {
                    LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_ChangeAddNotFound, "", token);
                    userPlayer = null;
                    return userPlayer;
                }
                else {
                    if (tokenUserPlayer == null)
                        return;
                    userPlayer = yield FindById(tokenUserPlayer.IdUserPlayer);
                    return userPlayer;
                }
            })).catch(err => {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_ChangeAddFail, err, token);
                return null;
            });
            return userPlayer;
        });
    }
}
exports.userPlayerController = new UserPlayerController();
function UserPlayerLoginSuccess(userPlayer, transferData, tokenAccount) {
    var tokenUserPlayer = new TokenUserPlayer_1.TokenUserPlayer();
    tokenUserPlayer.IdAccount = tokenAccount.IdAccount;
    tokenUserPlayer.IdDevice = tokenAccount.IdDevice;
    tokenUserPlayer.IdUserPlayer = userPlayer._id.toString();
    var tokenModel = new TokenModel_1.TokenModel();
    tokenModel.Token = TockenController_1.tokenController.AuthenGetToken(JSON.parse(JSON.stringify(tokenUserPlayer)));
    transferData.Token = tokenModel.Token;
    RedisConnect_1.redisClient.get(Env_1.RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), (error, result) => {
        if (error || result == null || result == undefined) {
            LogController_1.logController.LogDev("1685077900 KeyUserPlayerSession null");
            if (error) {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_CheckRedisSessionNone, error, transferData.Token);
            }
            else {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_CheckRedisSessionNone, "", transferData.Token);
            }
        }
        else {
            // Logout userplayer is logined
            LogController_1.logController.LogDev("1685077900 KeyUserPlayerSession Exsist");
            var userPlayerWithToken = new UserPlayer_1.UserPlayerWithToken();
            userPlayerWithToken.UserPlayerId = userPlayer._id.toString();
            userPlayerWithToken.Token = transferData.Token;
            var message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_Logout;
            message.Data = JSON.stringify(userPlayerWithToken);
            exports.userPlayerController.UserPlayerLogout(message);
            RedisConnect_1.redisPub.publish(Env_1.RedisConfig.MessagePubSub, JSON.stringify(message));
        }
        RedisConnect_1.redisClient.set(Env_1.RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), transferData.Token, (error, result) => {
            if (error) {
                LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_RedisSaveFail, error, transferData.Token);
            }
            else {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_RedisSaveSuccess, result, transferData.Token);
            }
        });
        RedisConnect_1.redisClient.EXPIRE(Env_1.RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), DateUtils_1.dateUtils.DayToSecond(7), (error, result) => {
            if (error) {
                LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_RedisExpireFail, error, transferData.Token);
            }
            else {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_RedisExpireSuccess, result, transferData.Token);
            }
        });
        RedisConnect_1.redisClient.set(Env_1.RedisKeyConfig.KeyUserPlayerData(userPlayer._id.toString()), JSON.stringify(userPlayer), (error, result) => {
            if (error) {
                LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_RedisCacheUserPlayerFail, error, transferData.Token);
            }
            else {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_RedisCacheUserPlayerSuccess, result, transferData.Token);
            }
        });
        var userPlayerSocket = new UserPlayer_1.UserPlayerSocket();
        userPlayerSocket.Socket = transferData.Socket;
        userPlayerSocket.Token = transferData.Token;
        userPlayerSocket.UserPlayerId = userPlayer._id.toString();
        UserPlayerService_1.userPlayerLoginCache[userPlayer._id.toString()] = userPlayerSocket;
        var message = new Message_1.Message();
        message.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_LoginSuccess;
        message.Data = JSON.stringify(tokenModel);
        var message_1 = new Message_1.Message();
        message_1.MessageCode = MessageCode_1.MessageCode.UserPlayerServer_Update;
        message_1.Data = JSON.stringify(userPlayer);
        transferData.Send(JSON.stringify(message), JSON.stringify(message_1));
    });
}
function FindById(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield UserPlayer_1.UserPlayerModel.findById(idUserPlayer)
            .then(res => {
            data = res;
            LogController_1.logController.LogMessage(LogCode_1.LogCode.UserPlayerServer_FoundInBD, idUserPlayer, "Server");
        }).catch(err => {
            LogController_1.logController.LogError(LogCode_1.LogCode.UserPlayerServer_NotFoundInBD, err, "Server");
        });
        var userPlayer = DataModel_1.DataModel.Parse(data);
        RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyUserPlayerData(idUserPlayer), JSON.stringify(userPlayer));
        return userPlayer;
    });
}
