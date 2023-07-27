import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AddUserSocketDictionary, SendMessageToSocket, userSocketDictionary } from "../../MessageServer/Service/MessageService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { ServerGame } from "../Model/ServerGame";
import { ServerGameCode } from "../Model/ServerGameCode";
import { CreateUserPlayer, FindByIdAccountAndServerGameCode, IUserPlayer, UpdateUserPlayer, UserPlayer } from "../Model/UserPlayer";
import { Redis } from '../../Enviroment/Env';
import { UserSocketData } from '../../UserSocket/Model/UserSocketData';
import { LogIdUserPlayer, LogUserSocket } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';
import { redisClient } from '../../Service/Database/RedisConnect';

export async function UserPlayerLogin(message : IMessage, userSocket : IUserSocket) {
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
    redisClient.set(Redis.KeyUserPlayerSession + idUserPlayer, token, (error, result) => {
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
    await redisClient.get(Redis.KeyUserPlayerSession + userPlayer._id.toString(), (error, result)=>{
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
            redisClient.publish(Redis.UserPlayerChannel, JSON.stringify(message));  
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