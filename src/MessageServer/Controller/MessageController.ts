import { Types } from "mongoose";
import redis from 'redis';
import { AccountData, IAccountData } from "../../AccountServer/Model/AccountData";
import { AccountTocken } from "../../AccountServer/Model/AccountTocken";
import { ITockenAuthen, TockenAuthen } from "../../AccountServer/Model/TockenAuthen";
import { AuthenVerify } from "../../AuthenServer/AuthenController";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { SendMessageToSocket } from "../Service/MessageService";

export async function Connect(message : IMessage, userSocket : IUserSocket){
    var tockenAuthen = TockenAuthen.Parse(message.Data);
    var data = AuthenVerify(tockenAuthen.Token);
    if(data == null || data == undefined){
        SendMessageToSocket(ConnectFailMessage("Token authen fail"), userSocket.Socket);
        console.log("Dev 1684937265 wrong token")
        return;
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != tockenAuthen.IdDevice){
            console.log("Dev 1684937311 wrong device")
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
        SendMessageToSocket(message, userSocket.Socket);
    }
}

function ConnectFailMessage(error){
    var message = new Message();
    message.MessageCode = MessageCode.MessageServer_ConnectFail;
    message.Data = error;
    return message;
}