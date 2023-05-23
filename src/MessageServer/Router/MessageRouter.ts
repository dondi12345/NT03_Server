import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";
import { ResLogin } from "../../ResServer/Controller/ResController";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { AccountLogin, AccountRegister } from "../../AccountServer/Controller/AccountController";
import { UserPlayerLogin } from "../../UserPlayerServer/Controller/UserPlayerController";


export function MessageRouter(message : IMessage, userSocket : IUserSocket){
    if(message.MessageCode == MessageCode.MessageTest){
        console.log("1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageConnect){
        Connect(message);
    }
    if(message.MessageCode == MessageCode.AccountServer_Register){
        AccountRegister(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.AccountServer_Login){
        AccountLogin(message, userSocket);
        return;
    }
    if(userSocket.IdAccount == null || userSocket.IdAccount == undefined){
        console.log("1684769809 Logout Acount")
        return;
    }
    if(message.MessageCode == MessageCode.UserPlayerServer_Login){
        UserPlayerLogin(message, userSocket);
        return;
    }
    if(userSocket.IdUserPlayer == null || userSocket.IdUserPlayer == undefined){
        console.log("1684769809 Logout Acount")
        return;
    } 
    if(message.MessageCode == MessageCode.Res_Login){
        ResLogin(message, userSocket)
    } 
}