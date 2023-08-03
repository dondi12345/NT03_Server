import { Types } from "mongoose";
import redis from 'redis';
import { AccountData, IAccountData } from "../../AccountServer/Model/AccountData";
import { AccountTocken } from "../../AccountServer/Model/AccountTocken";
import { ITockenAuthen, TockenAuthen } from "../../AccountServer/Model/TockenAuthen";
import { AuthenVerify } from "../../AuthenServer/AuthenController";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { SendMessageToSocket } from "../Service/MessageService";
import { LogServer, LogUserSocket } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";

export async function Connect(message : Message, userSocket : IUserSocket){
    var tockenAuthen = TockenAuthen.Parse(message.Data);
    var data = AuthenVerify(tockenAuthen.Token);
    if(data == null || data == undefined){
        SendMessageToSocket(ConnectFailMessage("Token authen fail"), userSocket.Socket);
        console.log("Dev 1684937265 wrong token")
        LogUserSocket(LogCode.MessageServer_TokenAuthenFail, userSocket, "",LogType.Warning)
        return;
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != tockenAuthen.IdDevice){
            console.log("Dev 1684937311 wrong device")
            LogUserSocket(LogCode.MessageServer_WrongDevice, userSocket, "",LogType.Warning)
            SendMessageToSocket(ConnectFailMessage("Wrong device"), userSocket.Socket);
            return; 
        }
        userSocket.IdAccount = new Types.ObjectId(accountData.IdAccount.toString());
        userSocket.Platform = tockenAuthen.Platform;

        var accountTocken = new AccountTocken();
        accountTocken.Token = tockenAuthen.Token;

        var message = new Message();
        message.MessageCode = MessageCode.MessageServer_ConnectSuccess;
        message.Data = JSON.stringify(accountTocken);
        console.log("Dev 1684993827 Token authen success")
        LogUserSocket(LogCode.MessageServer_TokenAuthenSuccess, userSocket, "", LogType.Normal)
        SendMessageToSocket(message, userSocket.Socket);
    }
}

function ConnectFailMessage(error){
    var message = new Message();
    message.MessageCode = MessageCode.MessageServer_ConnectFail;
    message.Data = error;
    return message;
}