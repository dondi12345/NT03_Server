import redis from 'redis'
import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AddUserSocketDictionary, SendMessageToSocket, userSocketDictionary } from "../../MessageServer/Service/MessageService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { ServerGame } from "../Model/ServerGame";
import { ServerGameCode } from "../Model/ServerGameCode";
import { CreateUserPlayer, FindByIdAccountAndServerGameCode, IUserPlayer, UpdateUserPlayer, UserPlayer, UserPlayerSocket, UserPlayerWithToken } from "../Model/UserPlayer";
import { RedisConfig, RedisKeyConfig } from '../../Enviroment/Env';
import { UserSocketData } from '../../UserSocket/Model/UserSocketData';
import { LogIdUserPlayer, LogUserSocket, logController } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';
import { TransferData } from '../../TransferData';
import { TokenAccount } from '../../Token/Model/TokenAccount';
import { tokenController } from '../../Token/Controller/TockenController';
import { DataModel } from '../../Utils/DataModel';
import { Model, Types } from 'mongoose';
import { redisClient, redisPub } from '../../Service/Database/RedisConnect';
import { userPlayerLoginCache as userPlayerCache } from '../Service/UserPlayerService';
import { TokenUserPlayer } from '../../Token/Model/TokenUserPlayer';
import { TokenModel } from '../../Token/Model/TokenModel';
import { dateUtils } from '../../Utils/DateUtils';

const redisUserPlayerSession = redis.createClient({
    host: RedisConfig.Host,
    port: RedisConfig.Port,
    password: RedisConfig.Password,
  });


function InitNewUserPlayer(userPlayer : UserPlayer){
    UserJoinToGlobalChannel(userPlayer._id, userPlayer.ServerGameCode);
}

function LoginFailMessage(error){
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_LoginFail;
    message.Data = error;
    return message;
}

export function UpdateUserPlayerCtrl(userSocket : UserSocket) {
    LogUserSocket(LogCode.UserPlayerServer_UpdateUserPlayer, userSocket, "", LogType.Normal);
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_Update;
    message.Data = JSON.stringify(userSocket.UserPlayer);
    UpdateUserPlayer(userSocket.UserPlayer);
    SendMessageToSocket(message, userSocket.Socket);
}

class UserPlayerController{
    UserPlayerLogin(message : Message, transferData : TransferData) {
        var data = tokenController.AuthenVerify(transferData.Token);
        if(data == null || data == undefined){
            logController.LogDev("1684937265 wrong token");
            logController.LogWarring(LogCode.UserPlayerServer_AuthenTokenFail,"Token authen fail", transferData.Token);
            transferData.Send(JSON.stringify(LoginFailMessage("Token authen fail")))
            return;
        }else{
            var tokenAccount = DataModel.Parse<TokenAccount>(data);
            var serverGame = DataModel.Parse<ServerGame>(message.Data);
            if(!(serverGame.ServerGameCode in ServerGameCode)){
                logController.LogDev("1684937276 Doesn't have ServerGame");
                logController.LogError(LogCode.UserPlayerServer_LoginFail,"Doesn't have ServerGame", transferData.Token);
                transferData.Send(JSON.stringify(LoginFailMessage("Token authen fail")))
                return;
            }
            FindByIdAccountAndServerGameCode(new Types.ObjectId(tokenAccount.IdAccount), serverGame.ServerGameCode).then(res=>{
                if(res == null || res == undefined){
                    var userPlayer = UserPlayer.NewUserPlayer(new Types.ObjectId(tokenAccount.IdAccount), serverGame.ServerGameCode);
                    CreateUserPlayer(userPlayer).then(res=>{
                        if(res == null || res == undefined){
                            logController.LogError(LogCode.UserPlayerServer_CreateFail, "Create Fail", transferData.Token);
                            transferData.Send(JSON.stringify(LoginFailMessage("Create Fail")))
                            return;
                        }else{
                            userPlayer = UserPlayer.Parse(res);
                            UserPlayerLoginSuccess(userPlayer, transferData, tokenAccount);
                            InitNewUserPlayer(userPlayer);
                            return;
                        }
                    }).catch(err=>{
                        logController.LogError(LogCode.UserPlayerServer_CreateFail, err, transferData.Token);
                        transferData.Send(JSON.stringify(LoginFailMessage("Create Fail")))
                    })
                }else{
                    var userPlayer = UserPlayer.Parse(res);
                    UserPlayerLoginSuccess(userPlayer, transferData, tokenAccount);
                    return;
                }
            }).catch(err=>{
                logController.LogError(LogCode.UserPlayerServer_CreateFail, err, transferData.Token);
                transferData.Send(JSON.stringify(LoginFailMessage(err)))
            })
        }
    }

    UserPlayerLogout(message : Message){
        logController.LogDev("1685077911 UserPlayerLogout")
        var userPlayerWithToken = DataModel.Parse<UserPlayerWithToken>(message.Data);
        var userPlayer = userPlayerCache[userPlayerWithToken.UserPlayerId];
        if(userPlayer == null || userPlayer == undefined) return;
        if(userPlayer.Token != userPlayerWithToken.Token && userPlayer.Socket != null && userPlayer.Socket != undefined){
            userPlayer.Socket.disconnect();
        }
    }

    async GetUserPlayerCached(token : string){
        var data = await new Promise(async(reslove, rejects)=>{
            var data = DataModel.Parse<TokenUserPlayer>(tokenController.AuthenVerify(token));
            if(data == null || data == undefined){
                logController.LogDev("1684937265 wrong token");
                logController.LogWarring(LogCode.UserPlayerServer_AuthenTokenFail,"Token authen fail", token);
                reslove(null);
            }else{
                redisClient.get(RedisKeyConfig.KeyUserPlayerData(data.IdUserPlayer), (error, result)=>{
                    if(error){
                        logController.LogWarring(LogCode.UserPlayerServer_RedisGetUserPlayerFail, error, token);
                        reslove(null);
                    }else{
                        reslove(result);
                    }
                })
            }
        })
        if(data == null || data == undefined){
            return null;
        }
        return DataModel.Parse<UserPlayer>(data)
    }
}

export const userPlayerController = new UserPlayerController();

function UserPlayerLoginSuccess(userPlayer : UserPlayer, transferData : TransferData, tokenAccount : TokenAccount){
    var tokenUserPlayer = new TokenUserPlayer();
    tokenUserPlayer.IdAccount = tokenAccount.IdAccount;
    tokenUserPlayer.IdDevice = tokenAccount.IdDevice;
    tokenUserPlayer.IdUserPlayer = userPlayer._id.toString();

    var tokenModel = new TokenModel();
    tokenModel.Token = tokenController.AuthenGetToken(JSON.parse(JSON.stringify(tokenUserPlayer)))
    transferData.Token = tokenModel.Token;

    redisClient.get(RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), (error, result)=>{
        if(error || result == null || result == undefined){
            logController.LogDev("1685077900 KeyUserPlayerSession null")
            if(error){
                logController.LogWarring(LogCode.UserPlayerServer_CheckRedisSessionNone, error, transferData.Token)
            }else{
                logController.LogMessage(LogCode.UserPlayerServer_CheckRedisSessionNone, "", transferData.Token)
            }
        }else{
            // Logout userplayer is logined
            logController.LogDev("1685077900 KeyUserPlayerSession Exsist")
            var userPlayerWithToken = new UserPlayerWithToken();
            userPlayerWithToken.UserPlayerId = userPlayer._id.toString();
            userPlayerWithToken.Token = transferData.Token;
            var message = new Message();
            message.MessageCode = MessageCode.UserPlayerServer_Logout;
            message.Data = JSON.stringify(userPlayerWithToken);
            userPlayerController.UserPlayerLogout(message);
            redisPub.publish(RedisConfig.MessagePubSub, JSON.stringify(message))
        }
        redisClient.set(RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), transferData.Token, (error, result)=>{
            if(error){
                logController.LogError(LogCode.UserPlayerServer_RedisSaveFail, error, transferData.Token)
            }else{
                logController.LogMessage(LogCode.UserPlayerServer_RedisSaveSuccess, result, transferData.Token)
            }
        })
        redisClient.EXPIRE(RedisKeyConfig.KeyUserPlayerSession(userPlayer._id.toString()), dateUtils.DayToSecond(7), (error, result)=>{
            if(error){
                logController.LogError(LogCode.UserPlayerServer_RedisExpireFail, error, transferData.Token)
            }else{
                logController.LogMessage(LogCode.UserPlayerServer_RedisExpireSuccess, result, transferData.Token)
            }
        })

        redisClient.set(RedisKeyConfig.KeyUserPlayerData(userPlayer._id.toString()), JSON.stringify(userPlayer), (error, result)=>{
            if(error){
                logController.LogError(LogCode.UserPlayerServer_RedisCacheUserPlayerFail, error, transferData.Token)
            }else{
                logController.LogMessage(LogCode.UserPlayerServer_RedisCacheUserPlayerSuccess, result, transferData.Token)
            }
        });

        var userPlayerSocket = new UserPlayerSocket();
        userPlayerSocket.Socket = transferData.Socket;
        userPlayerSocket.Token = transferData.Token;
        userPlayerSocket.UserPlayerId = userPlayer._id.toString();
        userPlayerCache[userPlayer._id.toString()] = userPlayerSocket;

        var message = new Message();
        message.MessageCode = MessageCode.UserPlayerServer_LoginSuccess;
        message.Data = JSON.stringify(tokenModel);

        var message_1 = new Message();
        message_1.MessageCode = MessageCode.UserPlayerServer_Update;
        message_1.Data = JSON.stringify(userPlayer);

        transferData.Send(JSON.stringify(message), JSON.stringify(message_1));
    });
}