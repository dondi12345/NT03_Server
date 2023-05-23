import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateUserPlayerRes, FindResByIdUserPlayer, IRes, Res, UpdateRes } from "../Model/Res";

export async function ResLogin(message : IMessage, userSocket: IUserSocket){
    await FindResByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        if(respone == null || respone == undefined){
            var res = new Res();
            res.IdUserPlayer = userSocket.IdUserPlayer;
            await CreateUserPlayerRes(res).then(respone=>{
                console.log("1684837963 " + respone)
                userSocket.Res = respone;
                SendMessageToSocket(LoginSuccessMessage(userSocket.Res), userSocket.Socket);
            }).catch(()=>{
                LoginFail(userSocket);
            })
        }else{
            console.log("1684837891 " + respone)
            userSocket.Res = respone;
            SendMessageToSocket(LoginSuccessMessage(userSocket.Res), userSocket.Socket);
        }
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

export function GainRes(message : IMessage, userSocket: IUserSocket){
    console.log("1684839042 "+message.Data)
    UpdateRes(message.Data,userSocket.IdUserPlayer); 
}