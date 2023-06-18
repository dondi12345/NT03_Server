import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateRes, FindItemByIdUserPlayerAndCode as FindResByIdUserPlayerAndCode, FindResByIdUserPlayer, IRes, Res, Reses, UpdateRes, IncreaseNumber } from "../Model/Res";
import { ResCode } from "../Model/ResCode";

export async function ResLogin(message : IMessage, userSocket: IUserSocket){
    await FindResByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        var reses = new Reses();
        for (let item of respone) {
            var res = Res.Parse(item);
            console.log("1686238820 "+ JSON.stringify(item));
            reses.Elements.push(res);
        }
        console.log("1685293709 "+respone.length)
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

export async function ChangeRes(code : ResCode, number: number, userSocket: IUserSocket) {
    console.log("1686239535 MinusRes");
    var res
    await FindResByIdUserPlayerAndCode(userSocket.IdUserPlayer, code).then(respone =>{
        res = respone;
    })
    if(res == null || res == undefined){
        await CreateNewRes(code, userSocket).then(respone=>{
            console.log("1686240263 " + respone);
            res = Res.Parse(respone);
        }).catch(e=>{
            console.log("1686239001 "+e);
        })
    }
    if(res == null || res == undefined) return false;
    if(res.Code == ResCode.Unknown) return false;
    if(res.Number + number <= 0) return false;
    res.Number += number;
    var result = true;
    console.log("1686728016 ", res);
    IncreaseNumber(res._id, number);
    UpdateResCtrl(res, userSocket);
    return result;
}

export async function CreateNewRes(resCode : ResCode ,userSocket: IUserSocket) {
    var res = new Res(resCode, userSocket.IdUserPlayer, 0);
    console.log("1686725503 "+ res);
    var resback = new Res(ResCode.Unknown, userSocket.IdUserPlayer, 0);
    await CreateRes(res).then(respone =>{
        resback = Res.Parse(respone);        
    }).catch(e=>{
        console.log("1686240493 "+e);
    })
    return resback;
}

export async function UpdateResCtrl(res : Res ,userSocket: IUserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.Res_Update;
    message.Data = JSON.stringify(res);
    SendMessageToSocket(message, userSocket.Socket);
}