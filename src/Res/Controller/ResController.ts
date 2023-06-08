import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateRes, FindItemByIdUserPlayer, IRes, Res, Reses, UpdateRes } from "../Model/Res";
import { ResCode } from "../Model/ResCode";

export async function ResLogin(message : IMessage, userSocket: IUserSocket){
    userSocket.ResDictionary = {};
    await FindItemByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        console.log("1685293708 "+respone)
        var reses = new Reses();
        for (let item of respone) {
            var res = Res.Parse(item);
            console.log("1685979990 "+ JSON.stringify(item));
            reses.Elements.push(res);
            userSocket.ResDictionary[res.ResCode] = res;
        }
        var message = new Message();
        message.MessageCode = MessageCode.Res_LoginSuccess;
        message.Data = JSON.stringify(reses);
        SendMessageToSocket(message, userSocket.Socket);
    }).catch(e=>{
        var message = new Message();
        message.MessageCode = MessageCode.Res_LoginFail;
        message.Data = "Item login fail";
        console.log("1685293337 "+ e);
        SendMessageToSocket(message, userSocket.Socket);
    })
}

export async function MinusRes(resCode : ResCode, number: number, userSocket: IUserSocket) {
    var data;
    if( userSocket.ResDictionary[resCode] == null ||  userSocket.ResDictionary[resCode] == undefined){
        var res = new Res(resCode, userSocket.IdUserPlayer, 0);
        await CreateNewRes(res, userSocket).then(respone=>{
            data = Res.Parse(respone);
        })
    }else{
        data = userSocket.ResDictionary[resCode];
    }
    if(data.ResCode == ResCode.Unknown) return false;
    data.Number--;
    UpdateResCtrl(data, userSocket);
    return true;
}

export async function CreateNewRes(res : Res ,userSocket: IUserSocket) {
    var resback : IRes;
    CreateRes(res).then(respone =>{
        resback = Res.Parse(respone);
        userSocket.ResDictionary[resback.ResCode] = resback;
        return resback;
    }).catch(e=>{
        var res_1 = new Res(ResCode.Unknown, userSocket.IdUserPlayer, 0);
        return res_1;
    })
}

export async function UpdateResCtrl(res : Res ,userSocket: IUserSocket) {
    userSocket.ResDictionary[res.ResCode] = res;
    UpdateRes(res);
    var message = new Message();
    message.MessageCode = MessageCode.Res_Update;
    message.Data = JSON.stringify(res);
    SendMessageToSocket(message, userSocket.Socket);
}