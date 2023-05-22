import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { ServerGame } from "../Model/ServerGame";
import { ServerGameCode } from "../Model/ServerGameCode";
import { CreateUserPlayer, FindByIdAccountAndServerGameCode, IUserPlayer, UserPlayer } from "../Model/UserPlayer";

export async function UserPlayerLogin(message : IMessage, userSocket : IUserSocket) {
    var serverGame = ServerGame.Parse(message.Data);
    if(!(serverGame.ServerGameCode in ServerGameCode)) return;
    await FindByIdAccountAndServerGameCode(userSocket.IdAccount, serverGame.ServerGameCode).then(res=>{
        if(res == null || res == undefined){
            var userPlayer = UserPlayer.NewUserPlayer(userSocket.IdAccount, serverGame.ServerGameCode);
            CreateUserPlayer(userPlayer).then(res=>{
                if(res == null || res == undefined){
                    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
                    return;
                }else{
                    userPlayer = UserPlayer.Parse(res);
                    LoginSuccess(userPlayer, userSocket);
                    InitNewUserPlayer(userPlayer);
                    return;
                }
            })
        }else{
            userPlayer = UserPlayer.Parse(res);
            LoginSuccess(userPlayer, userSocket);
            return;
        }
    })
}

function InitNewUserPlayer(userPlayer : UserPlayer){
    UserJoinToGlobalChannel(userPlayer._id, userPlayer.ServerGameCode);
}

function LoginSuccess(userPlayer:IUserPlayer ,userSocket : IUserSocket){
    SendMessageToSocket(LoginSuccessMessage(userPlayer), userSocket.Socket);
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_LoginFail;
    return message;
}
function LoginSuccessMessage(userPlayer : IUserPlayer){
    var message = new Message();
    message.MessageCode = MessageCode.UserPlayerServer_LoginSuccess;
    message.Data = UserPlayer.ToString(userPlayer);
    return message;
}