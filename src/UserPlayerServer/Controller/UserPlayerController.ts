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
import { Types } from 'mongoose';
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

export async function UserPlayerLogin(message : Message, userSocket : IUserSocket) {
    var serverGame = ServerGame.Parse(message.Data);
    if(!(serverGame.ServerGameCode in ServerGameCode)) return;
    await FindByIdAccountAndServerGameCode(userSocket.IdAccount, serverGame.ServerGameCode).then(res=>{
        if(res == null || res == undefined){
            var userPlayer = UserPlayer.NewUserPlayer(userSocket.IdAccount, serverGame.ServerGameCode);
            CreateUserPlayer(userPlayer).then(res=>{
                if(res == null || res == undefined){
                    SendMessageToSocket(LoginFailMessage("User create fail"), userSocket.Socket);
                    return;
                }else{
                    userPlayer = UserPlayer.Parse(res);
                    CheckUserLoginedFromRedis(userPlayer, userSocket);
                    InitNewUserPlayer(userPlayer);
                    return;
                }
            })
        }else{
            userPlayer = UserPlayer.Parse(res);
            CheckUserLoginedFromRedis(userPlayer, userSocket);
            return;
        }
    })
}

function InitNewUserPlayer(userPlayer : UserPlayer){
    UserJoinToGlobalChannel(userPlayer._id, userPlayer.ServerGameCode);
}

function LoginFailMessage(error){
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_LoginFail;
    message.Data = error;
    return message;
}
function LoginSuccessMessage(userPlayer : IUserPlayer){
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_LoginSuccess;
    message.Data = JSON.stringify(userPlayer);
    return message;
}

export function addAccountTokenToRedis(idUserPlayer :string, token: string) {
    redisUserPlayerSession.set(RedisConfig.KeyUserPlayerSession + idUserPlayer, token, (error, result) => {
        if (error) {
            console.error("Dev 1685008521 Failed to save token:", error);
            LogIdUserPlayer(LogCode.UserPlayerServer_SaveTokenFail, idUserPlayer, "", LogType.Normal)
        } else {
            console.log(`Dev 1685008516 Token added ${result}: `, token);
            LogIdUserPlayer(LogCode.UserPlayerServer_SaveToken, idUserPlayer, "", LogType.Normal)
        }
    });
}

export async function CheckUserLoginedFromRedis(userPlayer:IUserPlayer, userSocket : IUserSocket){
    await redisUserPlayerSession.get(RedisConfig.KeyUserPlayerSession + userPlayer._id.toString(), (error, result)=>{
        console.log("Dev 1685077900 "+result);
        if(error || result == null || result == undefined){
            userSocket.IdUserPlayer = userPlayer._id;
            addAccountTokenToRedis(userSocket.IdUserPlayer.toString(), userSocket.IdAccount.toString());
            AddUserSocketDictionary(userSocket);
            console.log("Dev 1685080451 "+Object.keys(userSocketDictionary).length)
            userSocket.UserPlayer = userPlayer;
            SendMessageToSocket(LoginSuccessMessage(userPlayer), userSocket.Socket);
        }else{
            var message = new Message();
            message.MessageCode = MessageCode.MessageServer_Disconnect;
            var userSocketData = new UserSocketData();
            userSocketData.IdUserPlayer = userPlayer._id;
            userSocketData.IdSocket = userSocket.Socket.id;
            message.Data = JSON.stringify(userSocketData);
            console.log(JSON.stringify(message));
            userSocket.Socket.disconnect();
            redisPub.publish(RedisConfig.UserPlayerChannel, JSON.stringify(message));  
        }
    });
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
                    userPlayer = UserPlayer.Parse(res);
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

        var userPlayerSocket = new UserPlayerSocket();
        userPlayerSocket.Socket = transferData.Socket;
        userPlayerSocket.Token = transferData.Token;
        userPlayerSocket.UserPlayerId = userPlayer._id.toString();
        userPlayerCache[userPlayer._id.toString()] = userPlayerSocket;

        var message = new Message();
        message.MessageCode = MessageCode.UserPlayerServer_LoginSuccess;
        message.Data = JSON.stringify(tokenModel);
        transferData.Send(JSON.stringify(message));
    });
}