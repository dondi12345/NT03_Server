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

const redisAccountToken = redis.createClient();

export async function Connect(message : IMessage, userSocket : IUserSocket){
    var tockenAuthen = TockenAuthen.Parse(message.Data);
    var data = AuthenVerify(tockenAuthen.Token);
    if(data == null || data == undefined){
        SendMessageToSocket(ConnectFailMessage("Token authen fail"), userSocket.Socket);
        console.log("1684937265 wrong token")
        return;
    }else{
        var accountData = AccountData.Parse(data);
        if(accountData.IdDevice != tockenAuthen.IdDevice){
            console.log("1684937311 wrong device")
            SendMessageToSocket(ConnectFailMessage("Wrong device"), userSocket.Socket);
            return; 
        }
        CheckAccountTokenFromRedis(accountData.IdAccount.toString(), userSocket, accountData, tockenAuthen);
    }
}

function ConnectFailMessage(error){
    var message = new Message();
    message.MessageCode = MessageCode.MessageServer_ConnectFail;
    message.Data = error;
    return message;
}

export function addAccountTokenToRedis(idAccount :string, accountToken: string) {
    redisAccountToken.mset("Account:Token:"+idAccount, accountToken, (error, result) => {
        if (error) {
            console.error('1685008521 Failed to save token:', error);
        } else {
            console.log(`1685008516 Token added ${result}: `, accountToken);
        }
    });
}

export async function CheckAccountTokenFromRedis(idAccount :string, userSocket : IUserSocket, accountData: IAccountData, tockenAuthen: ITockenAuthen){
    await redisAccountToken.get("Account:Token:"+idAccount, (error, result)=>{
        if(error || result == null || result == undefined){
            userSocket.IdAccount = new Types.ObjectId(accountData.IdAccount.toString());

            var accountTocken = new AccountTocken();
            accountTocken.Token = tockenAuthen.Token;

            var message = new Message();
            message.MessageCode = MessageCode.MessageServer_ConnectSuccess;
            message.Data = JSON.stringify(accountTocken);
            console.log("1684993827 Token authen success")
            addAccountTokenToRedis(accountData.IdAccount.toString(), JSON.stringify(accountTocken));
            SendMessageToSocket(message, userSocket.Socket);

        }else{
            console.log("1685010370 "+result);
            SendMessageToSocket(ConnectFailMessage("Has another login"), userSocket.Socket);  
        }
    });
}