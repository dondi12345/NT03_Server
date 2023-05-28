import { IMessage, Message } from "../Model/Message";
import { MessageCode } from "../Model/MessageCode";
import { Connect } from "../Controller/MessageController";
import { UpdateResCtrl, ResLogin } from "../../ResServer/Controller/ResController";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { AccountLogin, AccountRegister } from "../../AccountServer/Controller/AccountController";
import { UserPlayerLogin } from "../../UserPlayerServer/Controller/UserPlayerController";
import { GetSummonResult, HeroLogin, HireHero, Summon } from "../../HeroServer/Controller/HeroController";


export function MessageRouter(message : IMessage, userSocket : IUserSocket){
    if(message.MessageCode == MessageCode.MessageServer_Test){
        console.log("1684475214 Test Message")
    }
    if(message.MessageCode == MessageCode.MessageServer_Connect){
        Connect(message, userSocket);
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
        console.log("1685002171 Logout Acount")
        return;
    } 
    if(message.MessageCode == MessageCode.Res_Login){
        ResLogin(message, userSocket)
    } 
    if(message.MessageCode == MessageCode.Res_UpdateRes){
        UpdateResCtrl(message, userSocket)
    }
    if(message.MessageCode == MessageCode.Hero_Summon){
        Summon(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_GetSummonResult){
        GetSummonResult(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_HireHero){
        HireHero(message, userSocket);
        return;
    }
    if(message.MessageCode == MessageCode.Hero_Login){
        HeroLogin(message, userSocket);
        return;
    }
}