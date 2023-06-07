import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateUserPlayerRes, FindResByIdUserPlayer, IRes, Res, UpdateRes } from "../Model/Res";
import { ResCode } from "../Model/ResCode";
import { IResDetail, ResDetail } from "../Model/ResDetail";

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
    message.Data = JSON.stringify(res);
    return message;
}

export function UpdateResCtrl(message : IMessage, userSocket: IUserSocket){
    console.log("1684839042 "+message.Data)

    var listResDetal : IResDetail[] = JSON.parse(message.Data)
    UpdateRes(listResDetal, userSocket.IdUserPlayer); 
    var messageBack : Message = new Message();
    messageBack.MessageCode = MessageCode.Res_UpdateRes;
    messageBack.Data = JSON.stringify(listResDetal);
    SendMessageToSocket(messageBack, userSocket.Socket);
}

export function UpdateResByResCode(resCodes : ResCode[], userSocket: IUserSocket){
    var messageUpdateRes = new Message();
    messageUpdateRes.MessageCode = MessageCode.Res_UpdateRes;
    var listResDetal : ResDetail[] = [];
    for (let index = 0; index < resCodes.length; index++) {
        const element = resCodes[index];
        var resDetail = new ResDetail();
        resDetail.Name = ResCode[element];
        resDetail.Number = userSocket.Res[ResCode[element]];
        listResDetal.push(resDetail);  
    }
    messageUpdateRes.Data = JSON.stringify(listResDetal)
    UpdateResCtrl(messageUpdateRes, userSocket);
}