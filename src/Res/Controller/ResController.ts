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
            console.log("1686238820 "+ JSON.stringify(item));
            reses.Elements.push(res);
            userSocket.ResDictionary[res.Code] = res;
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

export async function MinusRes(code : ResCode, number: number, userSocket: IUserSocket) {
    console.log("1686239535 MinusRes");
    
    var data;
    if( userSocket.ResDictionary[code] == null ||  userSocket.ResDictionary[code] == undefined){
        var res = new Res(code, userSocket.IdUserPlayer, 0);
        await CreateNewRes(res, userSocket).then(respone=>{
            console.log("1686240263 " + respone);
            data = Res.Parse(respone);
        }).catch(e=>{
            console.log("1686239001 "+e);
        })
    }else{
        data = userSocket.ResDictionary[code];
        console.log("1686239666 " + data);
    }
    if(data.Code == ResCode.Unknown) return false;
    data.Number--;
    UpdateResCtrl(data, userSocket);
    return true;
}

export async function CreateNewRes(res : Res ,userSocket: IUserSocket) {
    var resback = new Res(ResCode.Unknown, userSocket.IdUserPlayer, 0);
    await CreateRes(res).then(respone =>{
        resback = Res.Parse(respone);
        userSocket.ResDictionary[resback.Code] = resback;
        
    }).catch(e=>{
        console.log("1686240493 "+e);
    })
    return resback;
}

export async function UpdateResCtrl(res : Res ,userSocket: IUserSocket) {
    userSocket.ResDictionary[res.Code] = res;
    UpdateRes(res);
    var message = new Message();
    message.MessageCode = MessageCode.Res_Update;
    message.Data = JSON.stringify(res);
    SendMessageToSocket(message, userSocket.Socket);
}