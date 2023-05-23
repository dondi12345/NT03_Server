import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateUserPlayerRes, FindUserPlayerResByIdUserPlayer, IRes, Res } from "../Model/Res";

export async function ResLogin(message : IMessage, userSocket: IUserSocket){
    await FindUserPlayerResByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        if(respone == null || respone == undefined){
            var res = new Res();
            await CreateUserPlayerRes(res).then(respone=>{
                userSocket.Res = respone;
            }).catch(()=>{
                LoginFail(userSocket);
            })
        }else{
            userSocket.Res = respone;
        }
        SendMessageToSocket(LoginSuccessMessage(userSocket.Res), userSocket.Socket);
    }).catch(()=>{
        LoginFail(userSocket);
    })
}

function LoginFail(userSocket: IUserSocket){
    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.Res_LoginFail;
    return message;
}
function LoginSuccessMessage(res : IRes){
    var message = new Message();
    message.MessageCode = MessageCode.Res_LoginSuccess;
    message.Data = res;
    return message;
}